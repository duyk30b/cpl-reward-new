import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { GetListRewardEarnedRequest, GetTotalRewardEarnedRequest } from './grpc-reward.dto'
import { GrpcRewardService } from './grpc-reward.service'

@Controller()
export class GrpcRewardController {
  constructor(private readonly grpcRewardService: GrpcRewardService) {}

  @GrpcMethod('RewardService')
  async getListRewardEarned(request: GetListRewardEarnedRequest) {
    return await this.grpcRewardService.getListRewardEarned(request)
  }

  @GrpcMethod('RewardService')
  async getTotalRewardEarned(request: GetTotalRewardEarnedRequest) {
    return await this.grpcRewardService.getTotalRewardEarned(request)
  }
}
