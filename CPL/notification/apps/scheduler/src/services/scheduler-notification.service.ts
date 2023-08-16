import { GroupNotification, GroupNotificationService } from '@libs/notification'
import { BullQueueService } from '@libs/redis'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class SchedulerNotificationService {
  private readonly logger = new Logger(SchedulerNotificationService.name)
  constructor(
    private readonly groupNotificationService: GroupNotificationService,
    private readonly bullQueueService: BullQueueService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async publishGroupNotifications() {
    const readyToPublishNotifications =
      await this.groupNotificationService.getReadyToPublishNotifications()
    if (!readyToPublishNotifications.length) return

    const promises = readyToPublishNotifications.map((notification) =>
      this.publishGroupNotification(notification),
    )

    await Promise.all(promises)
  }

  async publishGroupNotification(notification: GroupNotification) {
    await this.groupNotificationService.publish(notification.id)
    await this.bullQueueService.addGroupNotificationPublishJob(notification)
    this.logger.log(`Trigger publish notification: ${notification.id}`)
  }
}
