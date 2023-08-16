import { RewardAggregateService } from '@libs/typeorm/reward-aggregate'
import { RewardHistoryService } from '@libs/typeorm/reward-history'
import { Injectable } from '@nestjs/common'
import { GetRewardEarnedFilterDto } from './api-internal.dto'

@Injectable()
export class ApiInternalService {
  constructor(
    private readonly rewardAggregateService: RewardAggregateService,
    private readonly rewardHistoryService: RewardHistoryService,
  ) {}

  async getTotalRewardEarned(filter: GetRewardEarnedFilterDto, currency?: string) {
    const total = await this.rewardAggregateService.getTotalRewardEarnedByCurrency(filter, currency)
    return { data: total }
  }

  async getListRewardEarned(filter: GetRewardEarnedFilterDto) {
    const data = await this.rewardHistoryService.getListRewardEarned(filter)
    return { data }
  }
}
