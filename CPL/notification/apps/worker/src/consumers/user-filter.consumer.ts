import {
  EUserFilterByGroupJob,
  IFilterAllUserByGroupJob,
  IFilterChunkUserByConditionsJob,
  USER_FILTER_QUEUE,
} from '@libs/redis'
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { WorkerUserFilterService } from '../services/worker-user-filter.service'

@Processor(USER_FILTER_QUEUE)
export class UserFilterConsumer {
  constructor(
    private readonly workerUserFilterService: WorkerUserFilterService,
  ) {}

  @Process(EUserFilterByGroupJob.PROCESS_ALL)
  async processAllUsers(job: Job<IFilterAllUserByGroupJob>) {
    const { userGroupIds, methodAfterFilter, args } = job.data
    await this.workerUserFilterService.processAllUsers(
      userGroupIds,
      methodAfterFilter,
      args,
    )
  }

  @Process(EUserFilterByGroupJob.PROCESS_CHUNK)
  async processChunkUsers(job: Job<IFilterChunkUserByConditionsJob>) {
    const { userIds, methodAfterFilter, args } = job.data
    await this.workerUserFilterService.processChunkUsers(
      userIds,
      methodAfterFilter,
      args,
    )
  }
}
