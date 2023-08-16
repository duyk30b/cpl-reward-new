import { BullQueueService, ICheckBudget, QUEUE_EVENT } from '@lib/redis'
import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { WorkerCheckBudgetService } from './worker-check-budget.service'

@Processor(QUEUE_EVENT.CHECK_BUDGET)
export class WorkerCheckBudgetProcessor {
  private readonly logger = new Logger(WorkerCheckBudgetProcessor.name)

  constructor(
    private readonly bullQueueService: BullQueueService,
    private readonly workerCheckBudgetService: WorkerCheckBudgetService,
  ) {}

  @Process()
  async handleProcess({ data }: Job<ICheckBudget>) {
    const { userId, missionId, messageId } = data
    this.logger.log(`[${messageId}] handleCheckBudget: ${JSON.stringify(data)}`)

    const checkBudget = await this.workerCheckBudgetService.startCheckBudget(data)

    if (checkBudget.error.length) {
      this.logger.log(
        `[${messageId}] -- CheckBudged failed: UserID ${userId}, missionId ${missionId}, ${JSON.stringify(
          checkBudget.error,
        )}`,
      )
      return
    }

    this.logger.log(
      `[${messageId}] -- CheckBudged success: UserID ${userId}, missionId ${missionId}, ${JSON.stringify(
        checkBudget.data,
      )}`,
    )

    checkBudget.data.forEach((item) => {
      this.bullQueueService.addSendReward({
        messageId: data.messageId,
        userId: item.userId,
        userRewardHistoryId: item.userRewardHistoryId,
        tagIds: item.tagIds,
      })
    })
  }

  @OnQueueFailed()
  async handleFailed(job: Job, err: Error) {
    const { messageId, userId, missionId } = job.data
    this.logger.error(
      `[${messageId}] handleFailed: UserID ${userId}, missionId ${missionId}, error ${err.message}`,
    )
  }
}
