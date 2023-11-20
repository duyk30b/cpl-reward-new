import { CAMPAIGN_TYPE } from './campaign.enum'

export class CriteriaCampaign {
  id?: number
  type?: CAMPAIGN_TYPE
  isActive?: boolean
  isHidden?: boolean

  ids?: number[]

  id_notIn?: number[]

  activeTime?: number
}
