import { KafkaMessageDto } from '@libs/kafka'
import { TransformUppercase } from '@libs/util'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class BceDividendMessageDataDto {
  @Expose({ name: 'dividend_user_id' })
  dividendUserId: string

  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  @IsNotEmpty()
  @TransformUppercase()
  currency: string

  @Expose()
  @IsNotEmpty()
  amount: string

  @Expose({ name: 'before_balance' })
  @IsNotEmpty()
  beforeBalance: string

  @Expose({ name: 'ending_balance' })
  @IsNotEmpty()
  endingBalance: string

  @Expose({ name: 'add_dividend_at' })
  addDividendAt: string

  @Expose({ name: 'dividend_date' })
  dividendDate: string
}

export class BceDividendMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => BceDividendMessageDataDto)
  data: BceDividendMessageDataDto
}
