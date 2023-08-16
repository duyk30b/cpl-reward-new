import { Expose, Transform } from 'class-transformer'

export interface UserConditions {
  value: UserConditionItem[]
}

export default class UserConditionItem {
  property = 'kyc_verify_status'
  operator = '=='
  value = 'true'
}

export class UserConditionEntity {
  @Expose()
  property: string

  @Expose()
  operator: string

  @Expose()
  @Transform(({ value }) => String(value), { toPlainOnly: true })
  value: string

  @Expose()
  type?: string
}
