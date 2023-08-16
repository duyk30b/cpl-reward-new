import { randomItemsInArray } from '@lib/common/helpers/random.helper'
import { Campaign } from '@libs/typeorm/campaign'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class CampaignSeed {
  constructor(
    @InjectRepository(Campaign) private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async start(number: number) {
    const campaignsDto: Campaign[] = []
    for (let i = 0; i < number; i++) {
      const campaign = new Campaign()
      campaign.title = 'Campaign ' + i
      campaign.titleJa = 'Campaign ' + i
      campaign.description = 'Campaign ' + i
      campaign.descriptionJa = 'Campaign ' + i
      campaign.notificationLink = 'https://localhost.vn'
      campaign.notificationLinkJa = 'https://localhost.vn'
      campaign.campaignImage = 'https://localhost.vn'
      campaign.campaignImageJa = 'https://localhost.vn'

      campaign.startDate = Math.ceil(new Date('2023-01-31T04:45:41.587Z').getTime() / 1000)
      campaign.endDate = Math.ceil(new Date('2028-09-15T04:45:41.587Z').getTime() / 1000)
      campaign.priority = i
      campaign.type = randomItemsInArray([0, 3])
      campaign.isActive = false
      campaign.resetTime = '11:30'

      campaignsDto.push(campaign)
    }

    await this.campaignRepository.save(campaignsDto)
  }
}
