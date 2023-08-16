import { Expose } from 'class-transformer'
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { RewardRule } from '../reward-rule'
import { CAMPAIGN_STATUS, CAMPAIGN_TYPE } from './campaign.enum'

@Entity({ name: 'campaigns' })
export class Campaign extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Expose({ name: 'reward_rules' })
  rewardRules: RewardRule[]

  @Column()
  @Expose()
  title: string

  @Column({ name: 'title_ja' })
  @Expose({ name: 'title_ja' })
  titleJa: string

  @Column({ type: 'text', default: '' })
  @Expose()
  description: string

  @Column({ name: 'description_ja', type: 'text', default: '' })
  @Expose({ name: 'description_ja' })
  descriptionJa: string

  @Column({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  startDate: number

  @Column({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  endDate: number

  @Column({ name: 'notification_link', type: 'text', default: '' })
  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Column({ name: 'notification_link_ja', type: 'text', default: '' })
  @Expose({ name: 'notification_link_ja' })
  notificationLinkJa: string

  @Column({ name: 'campaign_image', type: 'text', default: '' })
  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Column({ name: 'campaign_image_ja', type: 'text', default: '' })
  @Expose({ name: 'campaign_image_ja' })
  campaignImageJa: string

  @Column({ default: 0 })
  @Expose()
  priority: number

  @Column({ name: 'type', type: 'tinyint', default: CAMPAIGN_TYPE.DEFAULT })
  @Expose({ name: 'type' })
  type: CAMPAIGN_TYPE

  @Column({ name: 'status', type: 'smallint', default: CAMPAIGN_STATUS.RUNNING })
  @Expose({ name: 'status' })
  status: CAMPAIGN_STATUS

  @Column({ name: 'reset_time' })
  @Expose({ name: 'reset_time' })
  resetTime: string

  @Column({ name: 'is_active', type: 'smallint', default: true })
  @Expose({ name: 'is_active' })
  isActive: boolean

  @Column({ name: 'is_lock', type: 'tinyint', default: false })
  @Expose({ name: 'is_lock' })
  isLock: boolean

  @Column({ name: 'is_hidden', type: 'tinyint', default: false })
  @Expose({ name: 'is_hidden' })
  isHidden: boolean

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
    const now = Math.floor(Date.now() / 1000)
    if (now < this.startDate) this.status = CAMPAIGN_STATUS.COMING_SOON
    if (this.startDate <= now && this.endDate > now) this.status = CAMPAIGN_STATUS.RUNNING
    if (now > this.endDate) this.status = CAMPAIGN_STATUS.ENDED

    if (this.type !== CAMPAIGN_TYPE.DEFAULT) this.isHidden = true
    if (this.status === CAMPAIGN_STATUS.RUNNING) this.isLock = true
  }
}
