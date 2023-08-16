import BigNumber from 'bignumber.js'
import { Expose, Transform, TransformationType } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { DELIVERY_METHOD, TARGET_USER, WALLET } from '../common/enum'
import { REWARD_HISTORY_STATUS } from './reward-history.enum'

@Entity({ name: 'user_reward_histories' })
export class RewardHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({ name: 'mission_id' })
  @Expose({ name: 'mission_id' })
  missionId: number

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: TARGET_USER,
    default: TARGET_USER.USER,
  })
  @Expose({ name: 'user_type' })
  userType: TARGET_USER

  @Column({
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
  @Expose({ name: 'amount' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return new BigNumber(value || 0)
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value.toString(10)
    }
    return value
  })
  amount: BigNumber

  @Expose({ name: 'note' })
  note: string

  @Column()
  @Expose()
  currency: string

  @Column({
    type: 'smallint',
    default: WALLET.EXCHANGE,
    transformer: {
      to: (value: WALLET) => {
        if (value === WALLET.EXCHANGE) return 1
        if (value === WALLET.CASHBACK) return 2
        if (value === WALLET.REWARD) return 4
        return 0
      },
      from: (value: number) => {
        if (value === 1) return WALLET.EXCHANGE
        if (value === 2) return WALLET.CASHBACK
        if (value === 4) return WALLET.REWARD
        return 0
      },
    },
  })
  @Expose({ name: 'wallet' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      if (value === 1) return WALLET.EXCHANGE
      if (value === 2) return WALLET.CASHBACK
      if (value === 4) return WALLET.REWARD
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      if (value === WALLET.EXCHANGE) return 1
      if (value === WALLET.CASHBACK) return 2
      if (value === WALLET.REWARD) return 4
    }
    return value
  })
  wallet: WALLET

  @Column({
    name: 'delivery_method',
    type: 'smallint',
    enum: DELIVERY_METHOD,
    default: DELIVERY_METHOD.AUTO,
  })
  @Expose({ name: 'delivery_method' })
  deliveryMethod: DELIVERY_METHOD

  @Column({ type: 'smallint', default: REWARD_HISTORY_STATUS.DEFAULT })
  @Expose()
  status: REWARD_HISTORY_STATUS

  @Column({ name: 'referrer_user_id', default: null })
  @Expose({ name: 'referrer_user_id' })
  referrerUserId: string

  @Column({ name: 'reference_id' })
  @Expose({ name: 'reference_id' })
  referenceId: string

  @Column({ name: 'balance_response' })
  @Expose({ name: 'balance_response' })
  balanceResponse: string
}
