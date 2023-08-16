import { Campaign } from '@libs/typeorm/campaign'
import { Expose } from 'class-transformer'

export class CampaignCheckin extends Campaign {
  @Expose({ name: 'reset_time' })
  resetTime: string

  @Expose({ name: 'should_show_popup' })
  shouldShowPopup = true

  static fromCampaign(campaign: Campaign): CampaignCheckin {
    const instance = new CampaignCheckin()
    Object.assign(instance, campaign)

    if (campaign.resetTime) {
      const reset = new Date()
      const [hours, minutes] = campaign.resetTime.split(':')
      reset.setUTCHours(Number(hours))
      reset.setUTCMinutes(Number(minutes))
      if (reset.getTime() < Date.now()) reset.setUTCDate(reset.getUTCDate() + 1)
      instance.resetTime = Math.floor(reset.getTime() / 1000).toString()
    }
    return instance
  }
}
