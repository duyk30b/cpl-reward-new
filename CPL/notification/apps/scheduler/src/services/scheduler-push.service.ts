import { ENotificationType, GroupNotificationService } from '@libs/notification'
import { PushSchedule, PushScheduleService } from '@libs/push-schedule'
import { BullQueueService, EMethodAfterFilterUser } from '@libs/redis'
import { EDeeplink } from '@libs/system-push-notification-setting'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class SchedulerPushService {
  private readonly logger = new Logger(SchedulerPushService.name)
  private readonly mobileAppName: string
  constructor(
    private readonly groupNotificationService: GroupNotificationService,
    private readonly pushScheduleService: PushScheduleService,
    private readonly bullQueueService: BullQueueService,
    private readonly configService: ConfigService,
  ) {
    this.mobileAppName = this.configService.get('global.mobile_app_name')
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendPushes() {
    const readyToProcessItems =
      await this.pushScheduleService.getReadyToProcessItems()
    if (!readyToProcessItems.length) return

    const promises = readyToProcessItems.map((push) => this.sendPush(push))

    await Promise.all(promises)
  }

  async sendPush(push: PushSchedule) {
    if (push.groupNotificationId) {
      const groupNotification = await this.groupNotificationService.findById(
        push.groupNotificationId,
      )
      if (!groupNotification.isActive || !groupNotification.isGlobal) {
        return
      }
    }

    const notificationId = `${ENotificationType.GLOBAL}-${push.groupNotificationId}`

    await this.pushScheduleService.startProcess(push.id)
    await this.bullQueueService.addFilterAllUserByGroupJob({
      userGroupIds: push.userGroups,
      methodAfterFilter: EMethodAfterFilterUser.SEND_PUSH,
      args: {
        pushScheduleId: push.id,
        notificationId: notificationId,
        deeplink: `${this.mobileAppName}://${EDeeplink.NOTIFICATION_DETAIL}?id=${notificationId}`,
        title: push.title,
        content: push.content,
      },
    })
    await this.pushScheduleService.complete(push.id)
    if (push.groupNotificationId) {
      await this.groupNotificationService.markPushSent(push.groupNotificationId)
    }
    this.logger.log(
      `Trigger send push for schedule ${push.id} - notification ${push.groupNotificationId}`,
    )
  }
}
