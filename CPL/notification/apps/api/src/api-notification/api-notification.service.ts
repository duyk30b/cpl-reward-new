import { DEFAULT_LANG } from '@libs/common'
import { NotificationAggregateService } from '@libs/notification-aggregate'
import { BullQueueService } from '@libs/redis'
import { EDeeplink } from '@libs/system-push-notification-setting'
import { Environment, SortType } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import {
  ApiNotificationDetailResponseDto,
  NotificationCountUnreadFilterDto,
  NotificationOfUserFilterDto,
} from './api-notification.dto'

@Injectable()
export class ApiNotificationService {
  constructor(
    private readonly notificationAggregateService: NotificationAggregateService,
    private readonly configService: ConfigService,
    private readonly bullQueueService: BullQueueService,
  ) {}

  async getListNotification(
    userId: string,
    notificationOfUserFilterDto: NotificationOfUserFilterDto,
    lang: string,
  ) {
    if (
      !notificationOfUserFilterDto.limit ||
      notificationOfUserFilterDto.limit > 1000
    ) {
      notificationOfUserFilterDto.limit = 10
    }

    // Khi lấy dữ liệu trang trước cần sort theo thời gian tăng dần rồi reverse kết quả để tránh back về trang đầu
    const sortByTime = notificationOfUserFilterDto.fromTime
      ? SortType.ASC
      : SortType.DESC

    const notifications =
      await this.notificationAggregateService.getListNotificationOfUser(
        userId,
        notificationOfUserFilterDto,
        sortByTime,
      )

    if (sortByTime == SortType.ASC) {
      notifications.reverse()
    }

    let prev = null
    let next = null
    if (notifications.length) {
      const prevFilter = {
        ...notificationOfUserFilterDto,
        fromTime: notifications[0].publishAt,
        toTime: null,
      }
      const nextFilter = {
        ...notificationOfUserFilterDto,
        toTime: notifications[notifications.length - 1].publishAt,
        fromTime: null,
      }
      const [prevNotifications, nextNotifications] = await Promise.all([
        this.notificationAggregateService.getListNotificationOfUser(
          userId,
          prevFilter,
        ),
        this.notificationAggregateService.getListNotificationOfUser(
          userId,
          nextFilter,
        ),
      ])

      if (prevNotifications.length) {
        prev = new URLSearchParams({
          from_time: notifications[0].publishAt as any,
          limit: notificationOfUserFilterDto.limit as any,
        }).toString()
      }

      if (nextNotifications.length) {
        next = new URLSearchParams({
          to_time: notifications[notifications.length - 1].publishAt as any,
          limit: notificationOfUserFilterDto.limit as any,
        }).toString()
      }
    }

    return {
      data: notifications.map((notification) => ({
        ...instanceToPlain(notification),
        title: notification.title[lang] || notification.title[DEFAULT_LANG],
      })),
      links: {
        prev,
        next,
      },
    }
  }

  async countUnread(
    userId: string,
    countUnreadFilterDto: NotificationCountUnreadFilterDto,
  ) {
    const count = await this.notificationAggregateService.countUnread(
      userId,
      countUnreadFilterDto,
    )
    return { count }
  }

  async getNotificationDetail(userId: string, typeAndId: string, lang: string) {
    const [type, id] = typeAndId.split('-') as any[]

    const notificationService =
      this.notificationAggregateService.getNotificationService(type)
    const notification = await notificationService.findById(id)
    if (
      !notification ||
      !notificationService.checkNotificationCanDisplayForUser(
        notification,
        userId,
      )
    ) {
      return {}
    }

    if (userId) {
      await notificationService.readNotification(userId, id)
    }

    return plainToInstance(
      ApiNotificationDetailResponseDto,
      {
        ...instanceToPlain(notification),
        id: typeAndId,
        title: notification.title[lang] || notification.title[DEFAULT_LANG],
        content:
          notification.content[lang] || notification.content[DEFAULT_LANG],
      },
      { excludeExtraneousValues: true },
    )
  }

  async readNotification(userId: string, typeAndId: string) {
    const [type, id] = typeAndId.split('-') as any[]

    const notificationService =
      this.notificationAggregateService.getNotificationService(type)

    const notification = await notificationService.findById(id)
    if (
      !notification ||
      !notificationService.checkNotificationCanDisplayForUser(
        notification,
        userId,
      )
    ) {
      return
    }

    await notificationService.readNotification(userId, id)
  }

  async readAllNotifications(userId: string) {
    await this.notificationAggregateService.readAllNotifications(userId)
  }

  async testPushForNotification(userId: string, typeAndId: string) {
    const env = this.configService.get('global.env')
    if (
      ![Environment.LOCAL, Environment.DEV, Environment.STAGING].includes(env)
    ) {
      return
    }

    const [type, id] = typeAndId.split('-') as any[]

    const notificationService =
      this.notificationAggregateService.getNotificationService(type)

    const notification = await notificationService.findById(id)

    if (!notification) return

    const lang = DEFAULT_LANG

    const mobileAppName = this.configService.get('global.mobile_app_name')
    await this.bullQueueService.addUserPushCommand({
      userId,
      pushScheduleId: 'test',
      notificationId: 'test',
      data: {
        deeplink: `${mobileAppName}://${EDeeplink.NOTIFICATION_DETAIL}?id=${typeAndId}`,
      },
      notification: {
        title: notification.title[lang],
        body: notification.content[lang],
      },
    })
  }
}
