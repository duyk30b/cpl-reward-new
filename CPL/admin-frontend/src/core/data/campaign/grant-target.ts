import { Expose, Transform } from 'class-transformer'
import { trimEndSmallDecimal } from '../../helpers/common.helper'

export class GrantTargetEntity {
  @Expose()
  user: string

  @Expose({ name: 'grant_method' })
  grantMethod: string = GRANT_METHOD.FIXED

  @Expose()
  @Transform(({ value }) => trimEndSmallDecimal(value), { toClassOnly: true })
  amount: string

  @Expose({ name: 'property_to_calculate_amount' })
  propertyToCalculateAmount = ''

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Transform(({ value }) => value || [], { toClassOnly: true })
  @Expose({ name: 'tag_ids' })
  tagIds: Array<number> = []
}

export enum GRANT_METHOD {
  FIXED = 'fixed',
  PERCENT = 'percent',
}

export default GrantTargetEntity
