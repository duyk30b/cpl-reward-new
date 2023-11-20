import BigNumber from 'bignumber.js'
import { Expose, Transform, TransformationType } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { WALLET } from '../common/enum'

@Entity({ name: 'reward_rules' })
export class RewardRule extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({ name: 'mission_id', nullable: true, default: null })
  @Expose({ name: 'mission_id' })
  missionId: number

  @Column({ name: 'type_rule', type: 'text', default: 'campaign' })
  @Expose({ name: 'type_rule' })
  typeRule: string

  @Column({
    name: 'key',
    type: 'text',
    default: '',
    transformer: {
      to: (value) => {
        if (value === WALLET.EXCHANGE) return 'balance'
        if (value === WALLET.REWARD) return 'reward'
        if (value === WALLET.CASHBACK) return 'cashback'
        return value
      },
      from: (value) => {
        if (value === 'balance') return WALLET.EXCHANGE
        if (value === 'reward') return WALLET.REWARD
        if (value === 'cashback') return WALLET.CASHBACK
        return value
      },
    },
  })
  @Expose({ name: 'key' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      if (value === 'balance') return WALLET.EXCHANGE
      if (value === 'cashback') return WALLET.CASHBACK
      if (value === 'reward') return WALLET.REWARD
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      if (value === WALLET.EXCHANGE) return 'balance'
      if (value === WALLET.CASHBACK) return 'cashback'
      if (value === WALLET.REWARD) return 'reward'
    }
    return value
  })
  wallet: WALLET

  @Column()
  @Expose()
  currency: string

  @Column({
    name: 'limit_value',
    type: 'decimal',
    precision: 49,
    scale: 18,
    nullable: true,
    default: 0,
    transformer: {
      to: (value: BigNumber) => value.toString(10),
      from: (value) => new BigNumber(value || 0),
    },
  })
  @Expose({ name: 'limit_value' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return new BigNumber(value || 0)
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value.toString(10)
    }
    return value
  })
  limitValue: BigNumber

  @Column({
    name: 'release_value',
    type: 'decimal',
    precision: 49,
    scale: 18,
    nullable: true,
    default: 0,
    transformer: {
      to: (value: BigNumber) => value.toString(10),
      from: (value) => new BigNumber(value || 0),
    },
  })
  @Expose({ name: 'release_value' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return new BigNumber(value || 0)
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value.toString(10)
    }
    return value
  })
  releaseValue: BigNumber // note: tren database chi cong tru dc 1 so co do dai khoang 15 so
}
