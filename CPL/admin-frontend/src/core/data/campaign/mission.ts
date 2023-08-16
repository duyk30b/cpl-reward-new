import { Expose, Type, Exclude, Transform } from 'class-transformer'
import { RewardRuleEntity, DefaultRewardRules } from './reward-rule'
import JudgmentConditionEntity from './judgment-condition'
import { UserConditionEntity } from './user-condition'
import GrantTargetEntity from './grant-target'
import moment from 'moment'
import { DisplayConditionEntity } from './display-condition'

export class MissionEntity {
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

  @Expose({ name: 'opening_date' })
  @Transform(({ value }) => moment(value).unix(), { toPlainOnly: true })
  @Transform(({ value }) => moment.unix(value).format('YYYY-MM-DDTHH:mm'), {
    toClassOnly: true,
  })
  openingDate: string

  @Expose({ name: 'closing_date' })
  @Transform(({ value }) => moment(value).unix(), { toPlainOnly: true })
  @Transform(({ value }) => moment.unix(value).format('YYYY-MM-DDTHH:mm'), {
    toClassOnly: true,
  })
  closingDate: string

  @Type(() => RewardRuleEntity)
  @Expose({ name: 'reward_rules' })
  rewardRules: RewardRuleEntity[] = DefaultRewardRules()

  @Type(() => JudgmentConditionEntity)
  @Expose({ name: 'judgment_conditions' })
  judgmentConditions: JudgmentConditionEntity[] = []

  @Type(() => UserConditionEntity)
  @Expose({ name: 'user_conditions' })
  userConditions: UserConditionEntity[] = [new UserConditionEntity()]

  @Type(() => GrantTargetEntity)
  @Expose({ name: 'grant_target' })
  @Transform(
    ({ value }) => value.filter((item: GrantTargetEntity) => item.user),
    {
      toPlainOnly: true,
    },
  )
  grantTarget: GrantTargetEntity[] = [new GrantTargetEntity()]

  @Exclude()
  @Type(() => Date)
  @Expose({ name: 'created_at' })
  createdAt: string

  @Exclude()
  @Type(() => Date)
  @Expose({ name: 'updated_at' })
  updatedAt: string

  @Expose({ name: 'priority' })
  @Transform(({ value }) => parseInt(value))
  priority = 0

  @Expose({ name: 'guide_link' })
  guideLink = ''

  @Expose({ name: 'guide_link_ja' })
  guideLinkJa = ''

  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward = 1

  @Expose()
  status = 0

  @Expose({ name: 'is_active' })
  isActive = MissionActive.ACTIVE

  @Exclude({ toPlainOnly: true })
  @Expose()
  get fullTitle() {
    if (this.id) {
      return `ID: ${this.id} - ${this.title}`
    }

    return this.title
  }

  @Exclude({ toPlainOnly: true })
  isModified = false

  @Type(() => DisplayConditionEntity)
  @Expose({ name: 'display_conditions' })
  displayConditions: DisplayConditionEntity[] = []
}

export enum MissionActive {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum MissionStatus {
  RUNNING = 1,
  OUT_OF_BUDGET = 2,
  ENDED = 3,
  COMING_SOON = 4,
}

export default MissionEntity
