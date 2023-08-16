import { GroupNotification } from '@libs/notification'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import {
  GROUP_NOTIFICATION_QUEUE,
  MAIL_COMMAND_QUEUE,
  PERSONAL_NOTIFICATION_QUEUE,
  PUSH_COMMAND_QUEUE,
  EUserFilterByGroupJob,
  USER_FILTER_QUEUE,
} from './bull-queue.variable'
import {
  IMailCommand,
  IFilterAllUserByGroupJob,
  IFilterChunkUserByConditionsJob,
  IUserPushCommand,
} from './bull-queue.interface'

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue(MAIL_COMMAND_QUEUE)
    private readonly mailCommandQueue: Queue,
    @InjectQueue(PUSH_COMMAND_QUEUE)
    private readonly pushCommandQueue: Queue,
    @InjectQueue(GROUP_NOTIFICATION_QUEUE)
    private readonly groupNotificationQueue: Queue,
    @InjectQueue(PERSONAL_NOTIFICATION_QUEUE)
    private readonly personalNotificationQueue: Queue,
    @InjectQueue(USER_FILTER_QUEUE)
    private readonly userFilterByGroupQueue: Queue,
  ) {}

  async addMailCommand(data: IMailCommand) {
    await this.mailCommandQueue.add(data)
  }

  async addUserPushCommand(data: IUserPushCommand) {
    await this.pushCommandQueue.add(data)
  }

  async addGroupNotificationPublishJob(data: GroupNotification) {
    await this.groupNotificationQueue.add(data)
  }

  async addFilterAllUserByGroupJob(data: IFilterAllUserByGroupJob) {
    await this.userFilterByGroupQueue.add(
      EUserFilterByGroupJob.PROCESS_ALL,
      data,
    )
  }

  async addFilterChunkUserByGroupJob(data: IFilterChunkUserByConditionsJob) {
    await this.userFilterByGroupQueue.add(
      EUserFilterByGroupJob.PROCESS_CHUNK,
      data,
    )
  }
}
