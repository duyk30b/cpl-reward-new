import { MissionService, MISSION_STATUS } from '@libs/typeorm/mission'
import { RewardAggregateService } from '@libs/typeorm/reward-aggregate/reward-aggregate.service'
import { RewardHistoryService } from '@libs/typeorm/reward-history'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class WorkerCheckBudgetService {
  private readonly logger = new Logger(WorkerCheckBudgetService.name)
  constructor(
    private readonly missionService: MissionService,
    private readonly rewardHistoryService: RewardHistoryService,
    private readonly rewardAggregateService: RewardAggregateService,
  ) {}

  async startCheckBudget(options: {
    missionId: number
    userId: string
    referrerUserId: string
    data: Record<string, any>
  }): Promise<{
    error: string[]
    data?: { userId: string; userRewardHistoryId: number; tagIds: number[] }[]
  }> {
    const mission = await this.missionService.findOneBy({ id: options.missionId })

    const countReward = await this.rewardHistoryService.countUserMissionSuccess({
      userId: options.userId,
      missionIds: [options.missionId],
    })
    const successCount = countReward[options.missionId]?.successCount || 0
    if (successCount >= mission.limitReceivedReward) {
      return { error: ['User has received enough rewards: limit Success count'] }
    }

    const increaseRelease = await this.rewardAggregateService.increaseReleaseRewardRule({
      mission,
      referrerUserId: options.referrerUserId,
      data: options.data,
    })
    if (increaseRelease.error.length > 0) return { error: increaseRelease.error }

    const isOutOfBudget = await this.rewardAggregateService.checkOutOfBudgetMission(
      options.missionId,
    )
    if (isOutOfBudget) {
      await this.missionService.update(
        { id: options.missionId },
        {
          status: MISSION_STATUS.OUT_OF_BUDGET,
          isOutOfBudget: true,
        },
      )
    }

    const rewardsInfo = await this.rewardAggregateService.createRewardHistory({
      userId: options.userId,
      referrerUserId: options.referrerUserId,
      missionId: options.missionId,
      data: options.data,
    })

    return { data: rewardsInfo, error: [] }
  }
}
