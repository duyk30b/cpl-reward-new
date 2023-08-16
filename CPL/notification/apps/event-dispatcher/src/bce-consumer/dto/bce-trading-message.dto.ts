import { KafkaMessageDto } from '@libs/kafka'
import { TransformUppercase } from '@libs/util'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'

export class BceTradingMessageDataDto {
  @Expose({ name: 'order_id' })
  orderId: string

  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  @IsNotEmpty()
  @TransformUppercase()
  coin: string

  @Expose()
  @IsNotEmpty()
  @TransformUppercase()
  currency: string

  @Expose()
  @IsNotEmpty()
  price: string

  @Expose({ name: 'executed_price' })
  @IsNotEmpty()
  executedPrice: string

  @Expose({ name: 'base_price' })
  @IsNotEmpty()
  basePrice: string

  @Expose()
  @IsNotEmpty()
  type: string

  @Expose({ name: 'trade_type' })
  @IsNotEmpty()
  tradeType: string

  @Expose()
  @IsNotEmpty()
  status: string

  @Expose()
  @IsNotEmpty()
  quantity: string

  @Expose({ name: 'executed_quantity' })
  @IsNotEmpty()
  executedQuantity: string

  @Expose({ name: 'cancel_by' })
  @IsOptional()
  cancelBy: string
}

export class BceTradingMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => BceTradingMessageDataDto)
  data: BceTradingMessageDataDto
}
