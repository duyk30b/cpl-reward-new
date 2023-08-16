import {
  Expose,
  instanceToInstance,
  instanceToPlain,
  plainToInstance,
  Transform,
  TransformationType,
  Type,
} from 'class-transformer'
import { timeToText } from '../../common/helpers/time.helper'
import { RewardRule } from '../reward-rule/reward-rule.model'
import { CampaignType } from './campaign.variable'

export class Campaign {
  @Expose({ name: 'id', toClassOnly: true })
  id: number

  @Expose({ name: 'title' })
  title: string

  @Expose({ name: 'title_ja' })
  titleJa: string

  @Expose({ name: 'description' })
  description: string

  @Expose({ name: 'description_ja' })
  descriptionJa: string

  @Expose({ name: 'start_date' })
  @Transform(({ value, type }) => {
    if (!value) return null
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return timeToText(new Date(value * 1000), 'YYYY-MM-DDThh:mm')
    }
    if (type === TransformationType.CLASS_TO_PLAIN) {
      return new Date(value).getTime() / 1000
    }
    return value
  })
  startDate: string

  @Expose({ name: 'end_date' })
  @Transform(({ value, type }) => {
    if (!value) return null
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return timeToText(new Date(value * 1000), 'YYYY-MM-DDThh:mm')
    }
    if (type === TransformationType.CLASS_TO_PLAIN) {
      return new Date(value).getTime() / 1000
    }
    return value
  })
  endDate: string

  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Expose({ name: 'notification_link_ja' })
  notificationLinkJa: string

  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Expose({ name: 'campaign_image_ja' })
  campaignImageJa: string

  @Expose({ name: 'priority' })
  priority: number

  @Expose({ name: 'type' })
  @Type(() => Number)
  type: CampaignType = CampaignType.DEFAULT

  @Expose({ name: 'created_at', toClassOnly: true })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return new Date(value * 1000).toISOString()
    }
    return value
  })
  createdAt: string

  @Expose({ name: 'updated_at', toClassOnly: true })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return new Date(value * 1000).toISOString()
    }
    return value
  })
  updatedAt: string

  @Expose({ name: 'is_active' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) return value == 1
    if (type === TransformationType.CLASS_TO_PLAIN) return value ? 1 : 0
    return value
  })
  isActive = false

  @Expose({ name: 'is_hidden' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) return value == 1
    if (type === TransformationType.CLASS_TO_PLAIN) return value ? 1 : 0
    return value
  })
  isHidden = false

  @Expose({ name: 'is_lock', toClassOnly: true })
  @Transform(({ value }) => value == 1)
  isLock = false

  @Expose({ name: 'status', toClassOnly: true })
  status: number

  @Expose({ name: 'reset_time' })
  @Transform(({ value, type }) => {
    if (!value) return null
    const [hours, minutes] = value.split(':')
    const reset = new Date()
    if (type === TransformationType.PLAIN_TO_CLASS) {
      reset.setUTCHours(Number(hours), Number(minutes))
      return timeToText(reset, 'hh:mm')
    }
    if (type === TransformationType.CLASS_TO_PLAIN) {
      reset.setHours(Number(hours), Number(minutes))
      return timeToText(reset, 'hh:mm', 0)
    }
    return value
  })
  resetTime = new Date('4/19/2023Z').toTimeString().slice(0, 5)

  @Expose({ name: 'reward_rules', toClassOnly: true })
  @Type(() => RewardRule)
  rewardRules: RewardRule[] = []

  static blank() {
    return new Campaign()
  }

  static fromPlain(dto: Record<string, any>): Campaign {
    return plainToInstance(Campaign, dto, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }

  static fromPlains(dto: Record<string, any>[]): Campaign[] {
    return plainToInstance(Campaign, dto, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }

  static fromInstance(campaign: Campaign): Campaign {
    return instanceToInstance(campaign, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
      ignoreDecorators: true,
    })
  }

  static toPlain(campaign: Campaign): Record<string, any> {
    return instanceToPlain(campaign, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }
}
