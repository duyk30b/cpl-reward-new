import { Expose, Type, Transform } from 'class-transformer'
import moment from 'moment'
import { trimEndSmallDecimal } from '../../helpers/common.helper'

export class CampaignWithoutRules {
  id: number
  title: string
  description: string
  status = CampaignStatus.RUNNING
  //@Expose({ name: 'detail_explain' })
  //detailExplain: string
  @Expose({ name: 'title_ja' })
  titleJa: string
  @Expose({ name: 'description_ja' })
  descriptionJa: string
  @Expose({ name: 'start_date' })
  startDate: number
  @Expose({ name: 'end_date' })
  endDate: number
  @Expose({ name: 'notification_link' })
  notificationLink: string
  @Expose({ name: 'campaign_image' })
  campaignImage: string
  @Expose({ name: 'notification_link_ja' })
  notificationLinkJa: string
  @Expose({ name: 'campaign_image_ja' })
  campaignImageJa: string
  @Transform(({ value }) => parseInt(value))
  priority: number

  @Expose({ name: 'type' })
  @Transform(({ value }) => parseInt(value))
  type: number

  @Expose({ name: 'created_at' })
  createdAt: number
  @Expose({ name: 'updated_at' })
  updatedAt: number

  @Expose({ name: 'is_active' })
  @Transform(({ value }) => parseInt(value))
  isActive = CampaignActive.INACTIVE

  @Expose({ name: 'is_hidden' })
  @Transform(({ value }) => parseInt(value))
  isHidden = CampaignHidden.UNHIDDEN

  @Expose({ name: 'is_lock' })
  isLock: number

  @Expose({ name: 'reset_time' })
  @Transform(
    ({ value }) => {
      if (!value) {
        return null
      }

      const [hours, minutes] = value.split(':')
      return moment().hours(hours).minutes(minutes).utc().format('HH:mm')
    },
    { toPlainOnly: true },
  )
  @Transform(
    ({ value }) => {
      if (!value) {
        return null
      }

      const [hours, minutes] = value.split(':')
      return moment.utc().hours(hours).minutes(minutes).local().format('HH:mm')
    },
    { toClassOnly: true },
  )
  resetTime: string
}

export class RewardRule {
  @Expose({ name: 'created_at' })
  createdAt: number
  @Expose({ name: 'updated_at' })
  updatedAt: number
  @Expose()
  id: number
  @Expose()
  key: string
  @Expose()
  currency: string
  @Expose({ name: 'limit_value' })
  @Transform(({ value }) => trimEndSmallDecimal(String(value)))
  limitValue: number
  @Expose({ name: 'release_value' })
  @Transform(({ value }) => trimEndSmallDecimal(String(value)))
  releaseValue: number
  @Expose({ name: 'campaign_id' })
  campaignId: number
  @Expose({ name: 'mission_id' })
  missionId: number
  @Expose({ name: 'type_rule' })
  typeRule: string
}

export class Campaign extends CampaignWithoutRules {
  @Type(() => RewardRule)
  @Expose({ name: 'reward_rules' })
  rewardRules: RewardRule[]
}

export class CampaignFilter {
  page: number
  limit: number
  @Expose({ name: 'search_field' })
  searchField: string
  @Expose({ name: 'search_text' })
  searchText: string
  sort: string
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export enum CampaignActive {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum CampaignHidden {
  HIDDEN = 1,
  UNHIDDEN = 0,
}

export enum CampaignStatus {
  RUNNING = 1,
  OUT_OF_BUDGET = 2,
  ENDED = 3,
  COMING_SOON = 4,
  INACTIVE = 99999, // This is virtual status, if is_active = false, we say: status = INACTIVE
}

export class Price {
  currency: string
  price: string
}

export enum CAMPAIGN_TYPE {
  DEFAULT = 0,
  ORDER = 3,
}

export enum CAMPAIGN_LOCK_STATUS {
  UNLOCKED = 0,
  LOCKED = 1,
}

export default Campaign
