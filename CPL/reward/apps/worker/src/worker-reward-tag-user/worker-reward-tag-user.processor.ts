import { UserTagService } from '@app/grpc-client/user-tag'
import { IRewardTagUser, QUEUE_EVENT } from '@lib/redis'
import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'

@Processor(QUEUE_EVENT.REWARD_TAG_USER)
export class RewardTagUserProcessor {
  private readonly logger = new Logger(RewardTagUserProcessor.name)
  constructor(private userTagService: UserTagService) {}

  @Process()
  async handleProcess({ data }: Job<IRewardTagUser>) {
    this.logger.log(`[userId_${data.userId}] handleTagUser: ${JSON.stringify(data)}`)
    return await this.userTagService.addUserTags({
      userTags: [data],
    })
  }

  @OnQueueFailed()
  async handleFailed(job: Job, error: Error) {
    this.logger.error(`handleFailed: ${error.message}`)
  }
}
