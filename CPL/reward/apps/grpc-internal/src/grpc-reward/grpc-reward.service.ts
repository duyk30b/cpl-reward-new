import { RewardAggregateService } from '@libs/typeorm/reward-aggregate'
import { RewardHistoryService } from '@libs/typeorm/reward-history'
import { Injectable } from '@nestjs/common'
import { GetListRewardEarnedRequest, GetTotalRewardEarnedRequest } from './grpc-reward.dto'

@Injectable()
export class GrpcRewardService {
  constructor(
    private readonly rewardAggregateService: RewardAggregateService,
    private readonly rewardHistoryService: RewardHistoryService,
  ) {}

  async getTotalRewardEarned(request: GetTotalRewardEarnedRequest) {
    const total = await this.rewardAggregateService.getTotalRewardEarnedByCurrency(
      request,
      request.currency,
    )
    return { data: total }
  }

  async getListRewardEarned(request: GetListRewardEarnedRequest) {
    const data = await this.rewardHistoryService.getListRewardEarned(request)
    return { data }
  }
}
