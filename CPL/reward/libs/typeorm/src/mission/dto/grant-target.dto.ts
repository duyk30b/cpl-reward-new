import { camelCaseToSnakeCase, snakeCaseToCamelCase } from '@lib/common'
import BigNumber from 'bignumber.js'
import {
  Expose,
  instanceToPlain,
  plainToInstance,
  Transform,
  TransformationType,
} from 'class-transformer'
import { TARGET_USER, WALLET } from '../../common/enum'
import { GRANT_METHOD } from '../mission.enum'

export class GrantTarget {
  @Expose({ name: 'user' })
  userType: TARGET_USER

  @Expose({ name: 'grantMethod' })
  grantMethod: GRANT_METHOD

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

  @Expose({ name: 'propertyToCalculateAmount' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return snakeCaseToCamelCase(value)
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return camelCaseToSnakeCase(value)
    }
    return value
  })
  property: string

  @Expose({ name: 'currency' })
  currency: string

  @Expose({ name: 'wallet' })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      if (value === 'DIRECT_BALANCE') return WALLET.EXCHANGE
      if (value === 'DIRECT_CASHBACK') return WALLET.CASHBACK
      if (value === 'DIRECT_REWARD') return WALLET.REWARD
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      if (value === WALLET.EXCHANGE) return 'DIRECT_BALANCE'
      if (value === WALLET.CASHBACK) return 'DIRECT_CASHBACK'
      if (value === WALLET.REWARD) return 'DIRECT_REWARD'
    }
    return value
  })
  wallet: WALLET

  @Expose({ name: 'tagIds' })
  tagIds?: Array<number>

  static fromPlains(input: Record<string, any>[]): GrantTarget[] {
    return plainToInstance(GrantTarget, input, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }

  static toPlains(input: GrantTarget[]): Record<string, any>[] {
    return instanceToPlain<GrantTarget>(input, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }
}
