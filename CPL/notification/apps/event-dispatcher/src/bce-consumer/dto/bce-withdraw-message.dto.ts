import { KafkaMessageDto } from '@libs/kafka'
import { TransformUppercase } from '@libs/util'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class BceWithdrawMessageDataDto {
  @Expose({ name: 'transaction_id' })
  transactionId: string

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

  @Expose({ name: 'currency_fee' })
  @IsNotEmpty()
  @TransformUppercase()
  currencyFee: string

  @Expose()
  @IsNotEmpty()
  fee: string

  @Expose()
  @IsNotEmpty()
  status: string
}

export class BceWithdrawMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => BceWithdrawMessageDataDto)
  data: BceWithdrawMessageDataDto
}
