import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'
import { CampaignFilter, RewardService } from '@lib/grpc-client/reward'
import { plainToInstance } from 'class-transformer'
import { Campaign } from '@lib/grpc-client/reward'
import { RewardCommonService } from '@lib/grpc-client/reward/reward-common.service'

@Injectable()
export class ApiCampaignService {
  constructor(
    private rewardService: RewardService,
    private rewardCommonService: RewardCommonService,
  ) {}

  async pagination(campaignFilter: CampaignFilter) {
    return await this.rewardService.pagination(campaignFilter)
  }

  async findOne(id: number): Promise<Campaign> {
    return await this.rewardService.findOneCampaign(id)
  }

  async create(dto: ApiCreateCampaignDto): Promise<Campaign> {
    const instance = plainToInstance(Campaign, dto, { ignoreDecorators: true })
    const campaign = await this.rewardService.createCampaign(instance)
    if (!campaign.id) {
      throw new HttpException(
        { success: false, message: 'CAMPAIGN.UPDATE.INVALID_TYPE' },
        HttpStatus.BAD_REQUEST,
      )
    }
    return plainToInstance(Campaign, campaign, { ignoreDecorators: true })
  }

  async update(id: number, dto: ApiUpdateCampaignDto) {
    dto.id = id
    const instance = plainToInstance(Campaign, dto, { ignoreDecorators: true })
    const result = await this.rewardService.updateCampaign(instance)

    if (result.success) {
      return plainToInstance(Campaign, result.campaign, {
        ignoreDecorators: true,
      })
    }

    throw new HttpException(result, HttpStatus.BAD_REQUEST)
  }

  async cancel(id: number) {
    return await this.rewardService.cancelCampaign(id)
  }

  remove(id: number) {
    return `This action removes a #${id} apiCampaign`
  }

  async findAllEvents() {
    return await this.rewardCommonService.getAllEvents()
  }

  async getGrantTargets() {
    return await this.rewardCommonService.getGrantTargets()
  }

  async getUserConditions() {
    return await this.rewardCommonService.getUserConditions()
  }

  async getDisplayConditions() {
    return await this.rewardCommonService.getDisplayConditions()
  }
}
