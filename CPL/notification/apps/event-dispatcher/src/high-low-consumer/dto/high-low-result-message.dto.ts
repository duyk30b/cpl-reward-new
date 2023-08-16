import { TransformUppercase } from '@libs/util'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class HighLowMode {
  @Expose()
  @TransformUppercase()
  @IsNotEmpty()
  mode: string

  @Expose()
  @IsNotEmpty()
  period: string
}

export class HighLowPair {
  @Expose()
  @TransformUppercase()
  @IsNotEmpty()
  symbol: string
}

export class HighLowResultMessageDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'trade_type' })
  @IsNotEmpty()
  tradeType: string

  @Expose()
  @IsNotEmpty()
  status: string

  @Expose()
  @ValidateNested()
  @Type(() => HighLowMode)
  mode: HighLowMode

  @Expose()
  @ValidateNested()
  @Type(() => HighLowPair)
  pair: HighLowPair
}
