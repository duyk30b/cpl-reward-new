import { MailScheduleService } from 'libs/mail-schedule/src'
import {
  ENotificationType,
  GroupNotificationService,
  PersonalNotificationService,
} from '@libs/notification'
import { PushScheduleService } from '@libs/push-schedule'
import { BullQueueService } from '@libs/redis'
import {
  ESystemPushNotificationType,
  getDeeplinkByNotiType,
  SystemPushNotificationSettingService,
} from '@libs/system-push-notification-setting'
import { UserSettingService } from '@libs/user-setting'
import { fillDataByLang, SortType } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectConnection } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Connection } from 'typeorm'
import { VARIABLE_LANG_MAP } from './notification-aggregate.const'
import {
  IAdminCreateGroupNotificationDto,
  IAdminUpdateGroupNotificationDto,
  ICountUnreadFilter,
  INotificationOfUserFilter,
  INotificationOfUserService,
  NotificationForUserDto,
} from './notification-aggregate.variable'

@Injectable()
export class NotificationAggregateService {
  private readonly mobileAppName: string
  constructor(
    private readonly systemPushNotificationSettingService: SystemPushNotificationSettingService,
    private readonly bullQueueService: BullQueueService,
    private readonly userSettingService: UserSettingService,
    private readonly configService: ConfigService,
    private readonly personalNotificationService: PersonalNotificationService,
    private readonly groupNotificationService: GroupNotificationService,
    private readonly mailCommandService: MailScheduleService,
    private readonly pushCommandService: PushScheduleService,
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    this.mobileAppName = this.configService.get('global.mobile_app_name')
  }

  async sendSystemNotificationToUser(
    userId: string,
    type: ESystemPushNotificationType,
    variables: Record<string, string | number>,
    params?: Record<string, string>,
  ) {
    const notificationSettings =
      await this.systemPushNotificationSettingService.findByType(type)
    if (!notificationSettings.length) return
    const lang = await this.userSettingService.getLocale(userId)

    for (let i = 0; i < notificationSettings.length; i++) {
      const notificationSetting = notificationSettings[i]
      if (!notificationSetting.isActive) continue

      const translatedVariables = Object.entries(variables || {}).reduce(
        (result, [key, value]) => {
          const translatedValue =
            VARIABLE_LANG_MAP?.[lang]?.[type]?.[key]?.[value] || value
          result[key] = translatedValue
          return result
        },
        {},
      )

      await this.bullQueueService.addUserPushCommand({
        userId,
        data: {
          deeplink: `${this.mobileAppName}://${getDeeplinkByNotiType(
            type,
            params,
          )}`,
        },
        notification: {
          title: fillDataByLang(
            notificationSetting.title,
            lang,
            translatedVariables,
          ),
          body: fillDataByLang(
            notificationSetting.content,
            lang,
            translatedVariables,
          ),
        },
      })
    }
  }

  async getListNotificationOfUser(
    userId: string,
    filter: INotificationOfUserFilter,
    sortByTime = SortType.DESC,
  ): Promise<NotificationForUserDto[]> {
    const { limit } = filter

    const personalQueryAndParams = (
      await this.personalNotificationService.buildListNotificationOfUserQuery(
        userId,
        filter,
      )
    ).getQueryAndParameters()
    const [personalQuery, personalParams] = personalQueryAndParams

    const globalQueryAndParams = (
      await this.groupNotificationService.buildListNotificationOfUserQuery(
        userId,
        filter,
      )
    ).getQueryAndParameters()
    const [globalQuery, globalParams] = globalQueryAndParams

    let result = await this.connection.query(
      `
      SELECT * FROM (
        ${personalQuery} UNION ALL ${globalQuery}
      ) sub
      ORDER BY publish_at ${sortByTime}
      LIMIT ?
    `,
      [...personalParams, ...globalParams, limit],
    )

    result = plainToInstance(NotificationForUserDto, result)

    return result
  }

  async countUnread(userId: string, filter: ICountUnreadFilter) {
    const [personalCount, globalCount] = await Promise.all([
      this.personalNotificationService.countUnread(userId, filter),
      this.groupNotificationService.countUnread(userId, filter),
    ])
    return personalCount + globalCount
  }

  async readAllNotifications(userId: string) {
    await Promise.all([
      this.personalNotificationService.readAllNotifications(userId),
      this.groupNotificationService.readAllNotifications(userId),
    ])
  }

  getNotificationService(type: ENotificationType): INotificationOfUserService {
    const map = {
      [ENotificationType.PERSONAL]: this.personalNotificationService,
      [ENotificationType.GLOBAL]: this.groupNotificationService,
    }
    return map[type] || this.personalNotificationService
  }

  async createGroupNotification(
    createGroupNotificationDto: IAdminCreateGroupNotificationDto,
  ) {
    const notification = await this.groupNotificationService.create(
      createGroupNotificationDto,
    )
    if (notification.needSendMail) {
      await this.mailCommandService.create({
        ...createGroupNotificationDto.mailSchedule,
        groupNotificationId: notification.id,
        title: createGroupNotificationDto.title,
        publishAt: createGroupNotificationDto.publishAt,
      })
    }
    if (notification.needSendPush) {
      await this.pushCommandService.create({
        ...createGroupNotificationDto.pushSchedule,
        groupNotificationId: notification.id,
        title: createGroupNotificationDto.title,
        publishAt: createGroupNotificationDto.publishAt,
      })
    }
  }

  async updateGroupNotification(
    updateGroupNotificationDto: IAdminUpdateGroupNotificationDto,
  ) {
    const notification = await this.groupNotificationService.update(
      updateGroupNotificationDto,
    )
    if (notification.needSendMail) {
      const existedMail =
        await this.mailCommandService.findByGroupNotificationId(notification.id)
      if (existedMail) {
        await this.mailCommandService.update(existedMail.id, {
          ...updateGroupNotificationDto.mailSchedule,
          title: updateGroupNotificationDto.title,
          publishAt: updateGroupNotificationDto.publishAt,
        })
      } else {
        await this.mailCommandService.create({
          ...updateGroupNotificationDto.mailSchedule,
          groupNotificationId: notification.id,
          title: updateGroupNotificationDto.title,
          publishAt: updateGroupNotificationDto.publishAt,
        })
      }
    } else {
      await this.mailCommandService.deleteByGroupNotificationId(notification.id)
    }

    if (notification.needSendPush) {
      const existedPush =
        await this.pushCommandService.findByGroupNotificationId(notification.id)
      if (existedPush) {
        await this.pushCommandService.update(existedPush.id, {
          ...updateGroupNotificationDto.pushSchedule,
          title: updateGroupNotificationDto.title,
          publishAt: updateGroupNotificationDto.publishAt,
        })
      } else {
        await this.pushCommandService.create({
          ...updateGroupNotificationDto.pushSchedule,
          groupNotificationId: notification.id,
          title: updateGroupNotificationDto.title,
          publishAt: updateGroupNotificationDto.publishAt,
        })
      }
    } else {
      await this.pushCommandService.deleteByGroupNotificationId(notification.id)
    }
  }
}
