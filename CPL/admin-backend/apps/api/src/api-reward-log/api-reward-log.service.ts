import { RewardService } from '@lib/grpc-client/reward'
import { MissionUserLogStatus } from '@lib/grpc-client/reward/reward.enum'
import { Injectable } from '@nestjs/common'
import {
  GetMissingRewardDto,
  InputUpdateRewardLogDto,
} from './api-reward-log.dto'

@Injectable()
export class ApiRewardLogService {
  constructor(private readonly rewardService: RewardService) {}

  async getMissingRewards(filter: GetMissingRewardDto) {
    return await this.rewardService.getMissingRewards(filter)
  }

  async countMissingReward() {
    return await this.rewardService.countRewardLog({
      status: MissionUserLogStatus.NEED_TO_RESOLVE,
    })
  }

  async resolveMissingReward(id: number, input: InputUpdateRewardLogDto) {
    return await this.rewardService.updateRewardLog({
      id,
      status: input.status,
    })
  }
}
