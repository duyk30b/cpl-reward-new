import { KafkaMessageDto } from '@libs/kafka'
import { TransformUppercase } from '@libs/util'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class BceDepositMessageDataDto {
  @Expose({ name: 'transaction_id' })
  @IsNotEmpty()
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

  @Expose()
  @IsNotEmpty()
  status: string
}

export class BceDepositMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => BceDepositMessageDataDto)
  data: BceDepositMessageDataDto
}
