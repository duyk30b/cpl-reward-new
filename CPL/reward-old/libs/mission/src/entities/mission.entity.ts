import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  AfterLoad,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/mysql/my-base.entity'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import { JsonColumnTransformer } from '@lib/mysql/typeorm.transformer'
import { Campaign } from '@lib/campaign/entities/campaign.entity'
import { UserRewardHistory } from '@lib/user-reward-history/entities/user-reward-history.entity'
import { MISSION_IS_ACTIVE, MISSION_STATUS, TARGET_TYPE } from '../enum'

@Entity({
  name: 'missions',
})
export class Mission extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

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

  @Column({ name: 'guide_link', default: null, type: 'text' })
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

  @Column({
    name: 'is_active',
    type: 'smallint',
    default: MISSION_IS_ACTIVE.ACTIVE,
  })
  @Expose({ name: 'is_active' })
  isActive: number

  @Column({
    type: 'smallint',
    default: MISSION_STATUS.RUNNING,
  })
  @Expose()
  status: number

  @Column({
    name: 'target_type',
    type: 'smallint',
    default: TARGET_TYPE.HYBRID,
  })
  @Expose({ name: 'target_type' })
  targetType: number

  @Column({
    name: 'judgment_conditions',
    default: null,
    transformer: JsonColumnTransformer,
    type: 'text',
  })
  @Expose({ name: 'judgment_conditions' })
  judgmentConditions: string

  @Column({
    name: 'user_conditions',
    default: null,
    transformer: JsonColumnTransformer,
    type: 'text',
  })
  @Expose({ name: 'user_conditions' })
  userConditions: string

  @Column({
    name: 'display_conditions',
    default: null,
    transformer: JsonColumnTransformer,
    type: 'text',
  })
  @Expose({ name: 'display_conditions' })
  displayConditions: string

  @Column({
    name: 'grant_target',
    default: null,
    transformer: JsonColumnTransformer,
    type: 'text',
  })
  @Expose({ name: 'grant_target' })
  grantTarget: string

  @OneToMany(() => RewardRule, (rewardRule) => rewardRule.mission, {
    eager: false,
  })
  @JoinColumn()
  @Expose({
    name: 'reward_rules',
  })
  rewardRules: RewardRule[]

  // @ManyToOne(() => Campaign, (campaign) => campaign.missions)
  // @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign

  // @OneToMany(
  //   () => UserRewardHistory,
  //   (userRewardHistory) => userRewardHistory.mission,
  //   { eager: false },
  // )
  // @JoinColumn()
  @Expose({
    name: 'user_reward_histories',
  })
  userRewardHistories: UserRewardHistory[]

  @AfterLoad()
  transformStringToJson() {
    if (this.judgmentConditions !== undefined)
      this.judgmentConditions = JSON.parse(this.judgmentConditions)
    if (this.userConditions !== undefined)
      this.userConditions = JSON.parse(this.userConditions)
    if (this.displayConditions !== undefined)
      this.displayConditions = JSON.parse(this.displayConditions)
    if (this.grantTarget !== undefined)
      this.grantTarget = JSON.parse(this.grantTarget)
  }
}

export class MissionWithSuccessCount extends Mission {
  @Expose({ name: 'success_number' })
  successNumber: number
}
