import { BullQueueService, ISendReward, QUEUE_EVENT } from '@lib/redis'
import { RewardHistoryService } from '@libs/typeorm/reward-history'
import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { WorkerSendRewardService } from './worker-send-reward.service'

@Processor(QUEUE_EVENT.SEND_REWARD)
export class WorkerSendRewardProcessor {
  private readonly logger = new Logger(WorkerSendRewardProcessor.name)

  constructor(
    private readonly bullQueueService: BullQueueService,
    private readonly workerSendRewardService: WorkerSendRewardService,
    private readonly rewardHistoryService: RewardHistoryService,
  ) {}

  @Process()
  async handleProcess({ data }: Job<ISendReward>) {
    const { userId, messageId, userRewardHistoryId, tagIds } = data
    this.logger.log(`[${messageId}] handleSendReward: ${JSON.stringify(data)}`)

    const history = await this.rewardHistoryService.findOneBy({ id: data.userRewardHistoryId })

    await this.workerSendRewardService.startSendReward(history)

    this.logger.log(
      `[${messageId}] -- Send Reward success: UserID ${userId}, missionId ${history.missionId}, userRewardHistoryId ${userRewardHistoryId} !!!`,
    )

    if (tagIds && tagIds.length) {
      this.bullQueueService.addRewardTagUser({
        userId: Number(history.userId),
        tagIds,
      })
    }
  }

  @OnQueueFailed()
  async handleFailed(job: Job, error: Error) {
    const { userId, messageId, userRewardHistoryId } = job.data
    this.logger.error(
      `[${messageId}] handleFailed: UserID ${userId}, userRewardHistoryId ${userRewardHistoryId}, error ${error.message}`,
    )
  }
}
