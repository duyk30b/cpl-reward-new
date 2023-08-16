import { UserService } from '@app/grpc-client'
import { BullQueueService, ICheckCondition, QUEUE_EVENT } from '@lib/redis'
import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { WorkerCheckConditionService } from './worker-check-condition.service'

@Processor(QUEUE_EVENT.CHECK_CONDITION)
export class WorkerCheckConditionProcessor {
  private readonly logger = new Logger(WorkerCheckConditionProcessor.name)

  constructor(
    private readonly bullQueueService: BullQueueService,
    private readonly userService: UserService,
    private readonly workerCheckConditionService: WorkerCheckConditionService,
  ) {}

  @Process()
  async handleProcess({ data }: Job<ICheckCondition>) {
    const { userId, missionId, messageId } = data
    this.logger.log(`[${messageId}] handleCheckCondition: ${JSON.stringify(data)}`)

    const user = await this.userService.findById(userId)
    if (!user) {
      this.logger.log(
        `[${messageId}] -- CheckCondition failed: UserID ${userId} - User does not exists`,
      )
      return
    }
    this.logger.log(`[${messageId}] handleGetUser: ${JSON.stringify(user)}`)

    const checkCondition = await this.workerCheckConditionService.checkConditions(data)
    if (!checkCondition.pass) {
      this.logger.log(
        `[${messageId}] -- CheckCondition failed: UserID ${userId}, missionId ${missionId} ${JSON.stringify(
          checkCondition.error,
        )}`,
      )
      return
    }
    this.logger.log(
      `[${messageId}] -- CheckCondition success: UserID ${userId}, missionId ${missionId} !!!`,
    )

    this.bullQueueService.addCheckBudgetJob({
      messageId: data.messageId,
      missionId: data.missionId,
      userId,
      referrerUserId: user.referredById || '0',
      data: data.data,
      createTime: data.createTime,
    })
  }

  @OnQueueFailed()
  async handleFailed(job: Job, error: Error) {
    const { messageId, userId, missionId } = job.data
    this.logger.error(
      `[${messageId}] handleFailed: UserID ${userId}, missionId ${missionId}, error ${error.message}`,
    )
  }
}
