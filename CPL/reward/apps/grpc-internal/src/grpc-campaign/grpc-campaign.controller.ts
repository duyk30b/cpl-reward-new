import { Campaign } from '@libs/typeorm/campaign'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
  CountMissingRewardHistoryRequest,
  PaginationCampaignRequest,
  PaginationRewardHistoryRequest,
} from './grpc-campaign.request'
import { GrpcCampaignService } from './grpc-campaign.service'

@Controller('campaign')
export class GrpcCampaignController {
  constructor(private readonly grpcCampaignService: GrpcCampaignService) {}

  @GrpcMethod('GrpcAdminCampaignService', 'FindOne')
  async findOne(request: { id: number }): Promise<Partial<Campaign>> {
    return await this.grpcCampaignService.findOneBy({ id: +request.id })
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Create')
  async create(request: Campaign): Promise<Partial<Campaign>> {
    return await this.grpcCampaignService.insertOne(request)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Cancel')
  async cancel(request: { id: number }): Promise<{ affected: number }> {
    return await this.grpcCampaignService.deleteBy({ id: +request.id })
  }

  @GrpcMethod('GrpcAdminCampaignService', 'Update')
  async update(request: Campaign) {
    return await this.grpcCampaignService.update(request)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'List')
  async list(request: PaginationCampaignRequest) {
    return await this.grpcCampaignService.paginationCampaign(request)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'GetMissingRewards')
  async getMissingRewards(request: PaginationRewardHistoryRequest) {
    return await this.grpcCampaignService.paginationMissingReward(request)
  }

  @GrpcMethod('GrpcAdminCampaignService', 'CountRewardLog')
  async countRewardLog(request: CountMissingRewardHistoryRequest) {
    const count = await this.grpcCampaignService.countMissingReward(request)
    return { count }
  }

  @GrpcMethod('GrpcAdminCampaignService', 'UpdateRewardLog')
  async updateRewardLog(request: { id: number }) {
    return await this.grpcCampaignService.retryRewardHistory(request.id)
  }
}
