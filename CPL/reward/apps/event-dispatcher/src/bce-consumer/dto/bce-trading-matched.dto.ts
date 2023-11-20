import { Expose, Type } from 'class-transformer'
import { IsDefined } from 'class-validator'

export class BceTradingMatchedDto {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string
}
