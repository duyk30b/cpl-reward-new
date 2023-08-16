import { Inject, Injectable } from '@nestjs/common'
import {
  IGrpcAdminCampaignService,
  Campaign,
  ListCampaign,
  CancelInput,
  CampaignFilter,
  ListMissingReward,
  MissingRewardFilter,
  CountRewardLogInput,
  UpdateCampaignResult,
} from '@lib/grpc-client/reward/reward.interface'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import {
  CountRewardLogResult,
  UpdateRewardLogInput,
  UpdateRewardLogResult,
} from '.'

@Injectable()
export class RewardService {
  private gCampSrv: IGrpcAdminCampaignService
  constructor(@Inject('CAMPAIGN_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gCampSrv = this.client.getService<IGrpcAdminCampaignService>(
      'GrpcAdminCampaignService',
    )
  }

  async pagination(campaignFilter: CampaignFilter): Promise<ListCampaign> {
    const result = await lastValueFrom(this.gCampSrv.list(campaignFilter))
    return plainToInstance(ListCampaign, result, {
      ignoreDecorators: true,
    })
  }

  async findOneCampaign(id: number): Promise<Campaign> {
    const response = await firstValueFrom(this.gCampSrv.findOne({ id: id }))
    return plainToInstance(Campaign, response, { ignoreDecorators: true })
  }

  async cancelCampaign(id: number) {
    return await firstValueFrom(
      this.gCampSrv.cancel(plainToInstance(CancelInput, { id: id })),
    )
  }

  async createCampaign(campaign: Campaign) {
    return await firstValueFrom(this.gCampSrv.create(campaign))
  }

  async updateCampaign(campaign: Campaign): Promise<UpdateCampaignResult> {
    return await firstValueFrom(this.gCampSrv.update(campaign))
  }

  async getMissingRewards(filter: MissingRewardFilter) {
    const req = this.gCampSrv.getMissingRewards(filter)
    const res = await lastValueFrom(req)

    return plainToInstance(ListMissingReward, res, { ignoreDecorators: true })
  }

  async updateRewardLog(input: UpdateRewardLogInput) {
    const req = this.gCampSrv.updateRewardLog(input)
    const res = await lastValueFrom(req)

    return plainToInstance(UpdateRewardLogResult, res, {
      ignoreDecorators: true,
    })
  }

  async countRewardLog(filter: CountRewardLogInput) {
    const req = this.gCampSrv.countRewardLog(filter)
    const res = await lastValueFrom(req)

    return plainToInstance(CountRewardLogResult, res, {
      ignoreDecorators: true,
    })
  }
}
