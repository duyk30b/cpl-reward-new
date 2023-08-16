import { PartialType } from '@nestjs/mapped-types'
import { ApiCreateCampaignDto } from './api-create-campaign.dto'

export class ApiUpdateCampaignDto extends PartialType(ApiCreateCampaignDto) {
  id: number
}
