import { Expose } from 'class-transformer'

export class FindMissionRequest {
  @Expose({ name: 'campaign_id' })
  campaignId: number
}
