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
import { RewardRule } from '../reward-rule'

export class Mission {
  @Expose({ name: 'id', toClassOnly: true })
  id: number

  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'title' })
  title: string

  @Expose({ name: 'title_ja' })
  titleJa: string

  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Expose({ name: 'detail_explain_ja' })
  detailExplainJa: string

  @Expose({ name: 'opening_date' })
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
  openingDate: string

  @Expose({ name: 'closing_date' })
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
  closingDate: string

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

  @Expose({ name: 'priority' })
  priority: number

  @Expose({ name: 'guide_link' })
  guideLink = ''

  @Expose({ name: 'guide_link_ja' })
  guideLinkJa = ''

  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward = 1

  @Expose({ name: 'is_active' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) return value == 1
    if (type === TransformationType.CLASS_TO_PLAIN) return value ? 1 : 0
    return value
  })
  isActive = true

  @Expose({ name: 'status', toClassOnly: true })
  status: number

  @Expose({ name: 'event_name' })
  @Transform(({ value, type, obj }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return value || obj.judgment_conditions[0].event_name
    }
    return value
  })
  eventName?: string

  @Expose({ name: 'judgment_conditions' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return JSON.stringify(value)
    }
    if (type === TransformationType.CLASS_TO_PLAIN) {
      return JSON.parse(value)
    }
    return value
  })
  judgmentConditions = '[]'

  @Expose({ name: 'user_conditions' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return JSON.stringify(value)
    }
    if (type === TransformationType.CLASS_TO_PLAIN) {
      return JSON.parse(value)
    }
    return value
  })
  userConditions = '[]'

  @Expose({ name: 'display_conditions' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return JSON.stringify(value)
    }
    if (type === TransformationType.CLASS_TO_PLAIN) {
      return JSON.parse(value)
    }
    return value
  })
  displayConditions = '[]'

  @Expose({ name: 'grant_target' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return JSON.stringify(value)
    }
    if (type === TransformationType.CLASS_TO_PLAIN) {
      return JSON.parse(value)
    }
    return value
  })
  grantTarget = '[]'

  @Expose({ name: 'reward_rules', toClassOnly: true })
  @Type(() => RewardRule)
  rewardRules: RewardRule[] = []

  static blank() {
    return new Mission()
  }

  static fromPlains(dto: Record<string, any>[]): Mission[] {
    return plainToInstance(Mission, dto, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }

  static fromInstance(mission: Mission): Mission {
    return instanceToInstance(mission, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
      ignoreDecorators: true,
    })
  }

  static toPlain(mission: Mission): Record<string, any> {
    return instanceToPlain(mission, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }
}
