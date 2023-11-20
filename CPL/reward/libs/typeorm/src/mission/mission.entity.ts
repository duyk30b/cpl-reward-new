import { Expose, Type } from 'class-transformer'
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { TARGET_USER } from '../common/enum'
import { RewardRule } from '../reward-rule'
import { GrantTarget } from './dto/grant-target.dto'
import { JudgmentCondition } from './dto/judgment-condition.dto'
import { UserCondition } from './dto/user-condition.dto'
import { MISSION_STATUS, TARGET_TYPE } from './mission.enum'
import { CAMPAIGN_TYPE } from '../campaign'

@Entity({ name: 'missions' })
export class Mission extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({ name: 'campaign_type', type: 'tinyint', nullable: true })
  @Expose({ name: 'campaign_type' })
  campaignType: CAMPAIGN_TYPE

  @Column({ name: 'event_name' })
  @Expose({ name: 'event_name' })
  eventName: string

  @Expose({ name: 'reward_rules' })
  @Type(() => RewardRule)
  rewardRules?: RewardRule[]

  @Column()
  @Expose()
  title: string

  @Column({ name: 'title_ja' })
  @Expose({ name: 'title_ja' })
  titleJa: string

  @Column({ name: 'detail_explain', type: 'text', default: '' })
  @Expose({ name: 'detail_explain' })
  detailExplain: string

  @Column({ name: 'detail_explain_ja', type: 'text', default: '' })
  @Expose({ name: 'detail_explain_ja' })
  detailExplainJa: string

  @Column({ name: 'guide_link', type: 'text', default: null })
  @Expose({ name: 'guide_link' })
  guideLink: string

  @Column({ name: 'guide_link_ja', type: 'text', default: '' })
  @Expose({ name: 'guide_link_ja' })
  guideLinkJa: string

  @Column({ name: 'opening_date' })
  @Expose({ name: 'opening_date' })
  openingDate: number

  @Column({ name: 'closing_date' })
  @Expose({ name: 'closing_date' })
  closingDate: number

  @Column({ default: 0 })
  @Expose()
  priority: number

  @Column({ name: 'limit_received_reward', default: 1 })
  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward: number

  @Column({ name: 'is_active', type: 'smallint', default: true })
  @Expose({ name: 'is_active' })
  isActive: boolean

  @Column({ name: 'is_out_of_budget', type: 'smallint', default: true })
  @Expose({ name: 'is_out_of_budget' })
  isOutOfBudget: boolean

  @Column({ type: 'smallint', default: MISSION_STATUS.RUNNING })
  @Expose()
  status: MISSION_STATUS

  @Column({
    name: 'judgment_conditions',
    type: 'text',
    default: null,
    transformer: {
      to: (value: JudgmentCondition[]) => JSON.stringify(JudgmentCondition.toPlains(value)),
      from: (value) => JudgmentCondition.fromPlains(JSON.parse(value)),
    },
  })
  @Expose({ name: 'judgment_conditions' })
  @Type(() => JudgmentCondition)
  judgmentConditions: JudgmentCondition[]

  @Column({
    name: 'user_conditions',
    type: 'text',
    default: null,
    transformer: {
      to: (value: UserCondition[]) => JSON.stringify(UserCondition.toPlains(value)),
      from: (value) => UserCondition.fromPlains(JSON.parse(value)),
    },
  })
  @Expose({ name: 'user_conditions' })
  @Type(() => UserCondition)
  userConditions: UserCondition[]

  @Column({
    name: 'grant_target',
    type: 'text',
    default: null,
    transformer: {
      to: (value: GrantTarget[]) => JSON.stringify(GrantTarget.toPlains(value)),
      from: (value: string) => GrantTarget.fromPlains(JSON.parse(value)),
    },
  })
  @Expose({ name: 'grant_target' })
  @Type(() => GrantTarget)
  grantTarget: GrantTarget[]

  @Column({
    name: 'display_conditions',
    type: 'text',
    default: null,
    transformer: {
      to: (value: UserCondition[]) => JSON.stringify(UserCondition.toPlains(value)),
      from: (value: string) => UserCondition.fromPlains(JSON.parse(value)),
    },
  })
  @Expose({ name: 'display_conditions' })
  @Type(() => UserCondition)
  displayConditions: UserCondition[]

  @Column({ name: 'target_type', type: 'smallint', default: 0 })
  @Expose({ name: 'target_type' })
  targetType: TARGET_TYPE

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) this.createdAt = Math.floor(Date.now() / 1000)
    if (!this.updatedAt) this.updatedAt = Math.floor(Date.now() / 1000)
    this.setDefaultValue()
  }

  @BeforeUpdate()
  beforeUpdate() {
    if (!this.updatedAt) this.updatedAt = Math.floor(Date.now() / 1000)
    this.setDefaultValue()
  }

  setDefaultValue() {
    // set targetType
    let hasUser = false
    let hasReferralUser = false
    this.grantTarget?.map((target) => {
      if (target.userType === TARGET_USER.USER) hasUser = true
      if (target.userType === TARGET_USER.REFERRAL_USER) hasReferralUser = true
    })
    if (hasUser && hasReferralUser) this.targetType = TARGET_TYPE.HYBRID
    else if (hasUser) this.targetType = TARGET_TYPE.ONLY_MAIN
    else if (hasReferralUser) this.targetType = TARGET_TYPE.ONLY_REFERRED
  }
}
