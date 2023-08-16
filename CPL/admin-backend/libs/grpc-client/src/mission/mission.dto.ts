import { Expose, Type } from 'class-transformer'
import { GRANT_METHOD } from './mission.enum'

export class Mission {
  @Expose()
  id: number

  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose()
  title: string

  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Expose({ name: 'title_ja' })
  titleJa: string

  @Expose({ name: 'detail_explain_ja' })
  detailExplainJa: string

  @Expose({ name: 'guide_link_ja' })
  guideLinkJa: string

  @Expose({ name: 'opening_date' })
  openingDate: number

  @Expose({ name: 'closing_date' })
  closingDate: number

  @Type(() => RewardRule)
  @Expose({ name: 'reward_rules' })
  rewardRules: RewardRule[]

  @Type(() => JudgmentCondition)
  @Expose({ name: 'judgment_conditions' })
  judgmentConditions: JudgmentCondition[]

  @Type(() => UserCondition)
  @Expose({ name: 'user_conditions' })
  userConditions: UserCondition[]

  @Type(() => UserCondition)
  @Expose({ name: 'display_conditions' })
  displayConditions: UserCondition[]

  @Type(() => GrantTarget)
  @Expose({ name: 'grant_target' })
  grantTarget: GrantTarget[]

  @Expose({ name: 'created_at' })
  createdAt: string

  @Expose({ name: 'updated_at' })
  updatedAt: string

  @Expose({ name: 'priority' })
  priority: number

  @Expose({ name: 'guide_link' })
  guideLink: string

  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward: number

  @Expose()
  status: number

  @Expose({ name: 'is_active' })
  isActive: number
}

export class ListMission {
  @Type(() => Mission)
  @Expose()
  missions: Mission[] = []
}

export class RewardRule {
  @Expose()
  id: number

  @Expose()
  key: string

  @Expose()
  currency: string

  @Expose({ name: 'limit_value' })
  limitValue: string

  @Expose({ name: 'release_value' })
  releaseValue: number

  @Expose({ name: 'created_at' })
  createdAt: string

  @Expose({ name: 'updated_at' })
  updatedAt: string
}

export class JudgmentCondition {
  @Expose({ name: 'event_name' })
  eventName: string

  @Expose()
  property: string

  @Expose()
  operator: string

  @Expose()
  value: string

  @Expose()
  type: string
}

export class UserCondition {
  @Expose()
  property: string

  @Expose()
  operator: string

  @Expose()
  value: string

  @Expose()
  type: string
}

export class GrantTarget {
  @Expose()
  user: string

  @Expose({ name: 'grant_method' })
  grantMethod: GRANT_METHOD = GRANT_METHOD.FIXED

  @Expose()
  amount: string

  @Expose({ name: 'property_to_calculate_amount' })
  propertyToCalculateAmount = ''

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Expose({ name: 'tag_ids' })
  tagIds: Array<number>
}

export class MissionFilter {
  campaignId: number
}
