import { GroupNotification } from '@libs/notification'
import { GROUP_NOTIFICATION_QUEUE } from '@libs/redis'
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { WorkerGroupNotificationService } from '../services/worker-group-notification.service'

@Processor(GROUP_NOTIFICATION_QUEUE)
export class GroupNotificationConsumer {
  constructor(
    private readonly workerGroupNotificationService: WorkerGroupNotificationService,
  ) {}

  @Process()
  handleGroupNotificationPublish(job: Job<GroupNotification>) {
    this.workerGroupNotificationService.handleGroupNotificationPublish(job.data)
  }
}
