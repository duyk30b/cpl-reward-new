import { Expose, plainToClass, Transform, Exclude } from 'class-transformer'
import { trimEndSmallDecimal } from '../../helpers/common.helper'

export class RewardRuleEntity {
  @Expose()
  id: number

  @Expose()
  key: string

  @Expose()
  currency = 'USDT'

  @Expose({ name: 'limit_value' })
  @Transform(({ value }) => trimEndSmallDecimal(value), { toClassOnly: true })
  limitValue = '0'

  @Exclude({ toPlainOnly: true })
  @Expose({ name: 'release_value' })
  @Transform(({ value }) => trimEndSmallDecimal(String(value)))
  releaseValue = '0'

  @Expose({ name: 'created_at' })
  createdAt: string

  @Expose({ name: 'updated_at' })
  updatedAt: string
}

export const RewardRuleKeys = ['balance', 'cashback', 'reward']

export const DefaultRewardRules = () =>
  RewardRuleKeys.map((key) =>
    plainToClass(RewardRuleEntity, {
      key,
      currency: 'USDT',
      limit_value: '',
      release_value: '0',
    }),
  )
