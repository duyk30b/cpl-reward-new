import { MailScheduleService } from 'libs/mail-schedule/src'
import {
  GroupNotificationService,
  IGroupNotificationFilter,
} from '@libs/notification'
import { NotificationAggregateService } from '@libs/notification-aggregate'
import {
  IAdminCreateGroupNotificationDto,
  IAdminUpdateGroupNotificationDto,
} from '@libs/notification-aggregate/notification-aggregate.variable'
import { PushScheduleService } from '@libs/push-schedule'
import { BullQueueService, IMailCommand } from '@libs/redis'
import { Injectable } from '@nestjs/common'
import { ISendMailRequest } from './grpc-notification.interface'
import { SUPPORTED_LANGS } from '@libs/common'

@Injectable()
export class GrpcNotificationService {
  constructor(
    private readonly bullQueueService: BullQueueService,
    private readonly groupNotificationService: GroupNotificationService,
    private readonly notificationAggregateService: NotificationAggregateService,
    private readonly mailScheduleService: MailScheduleService,
    private readonly pushScheduleService: PushScheduleService,
  ) {}

  async sendMail(sendMailRequest: ISendMailRequest) {
    const { userIds, emails, mailCommand } = sendMailRequest

    const data = JSON.parse(sendMailRequest.data)

    const baseMailCommand: IMailCommand = {
      ...mailCommand,
      data,
    }

    if (userIds) {
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i]

        this.bullQueueService.addMailCommand({
          ...baseMailCommand,
          userId,
        })
      }
    }

    if (emails) {
      for (let i = 0; i < emails.length; i++) {
        const email = emails[i]
        this.bullQueueService.addMailCommand({
          ...baseMailCommand,
          email,
        })
      }
    }
    return { success: true }
  }

  async getListGroupNotification(
    groupNotificationFilter: IGroupNotificationFilter,
  ) {
    return await this.groupNotificationService.getListForManagement(
      groupNotificationFilter,
    )
  }

  async findGroupNotificationById(id: string) {
    const data = await this.groupNotificationService.findById(id)
    if (!data) return { data }

    if (data.needSendMail) {
      data['mailSchedule'] =
        await this.mailScheduleService.findByGroupNotificationId(data.id)
    }
    if (data.needSendPush) {
      data['pushSchedule'] =
        await this.pushScheduleService.findByGroupNotificationId(data.id)
    }
    return { data }
  }

  async createGroupNotification(
    createGroupNotificationDto: IAdminCreateGroupNotificationDto,
  ) {
    try {
      await this.notificationAggregateService.createGroupNotification(
        createGroupNotificationDto,
      )
      return { success: true }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  async updateGroupNotification(
    updateGroupNotificationDto: IAdminUpdateGroupNotificationDto,
  ) {
    try {
      await this.notificationAggregateService.updateGroupNotification(
        updateGroupNotificationDto,
      )
      return { success: true }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  async getSupportedLangs() {
    return { data: SUPPORTED_LANGS }
  }
}
