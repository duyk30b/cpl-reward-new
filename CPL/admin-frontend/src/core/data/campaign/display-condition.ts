import { Expose, Transform } from 'class-transformer'

export class DisplayConditionEntity {
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
