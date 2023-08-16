import { KafkaMessageDto } from '@libs/kafka'
import { TransformUppercase } from '@libs/util'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import {
  ExchangeUserType,
  OrderClass,
  OrderStatus,
  OrderType,
  StopDirection,
} from '../exchange-consumer.variable'

export class ExchangeOpenOrderMessageDataDto {
  @Expose({ name: 'order_id' })
  @IsNotEmpty()
  orderId: string

  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  @IsNotEmpty()
  @TransformUppercase()
  currency: string

  @Expose()
  @IsNotEmpty()
  @TransformUppercase()
  coin: string

  @Expose()
  @IsNotEmpty()
  status: OrderStatus

  @Expose({ name: 'order_class' })
  @IsNotEmpty()
  orderClass: OrderClass

  @Expose({ name: 'order_type' })
  @IsNotEmpty()
  orderType: OrderType

  @Expose({ name: 'order_resource' })
  orderResource: number

  @Expose()
  price: string

  @Expose({ name: 'user_type' })
  @IsNotEmpty()
  userType: ExchangeUserType

  @Expose()
  volume: string

  @Expose({ name: 'filled_volume' })
  filledVolume: string

  @Expose({ name: 'stop_direction' })
  stopDirection?: StopDirection

  get realOrderClass() {
    if (this.stopDirection != StopDirection.UNDEFINED && this.stopDirection) {
      if (this.orderClass == OrderClass.LIMIT) return OrderClass.STOP_LIMIT
      if (this.orderClass == OrderClass.MARKET) return OrderClass.STOP_MARKET
    }

    return this.orderClass
  }
}

export class ExchangeOpenOrderMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => ExchangeOpenOrderMessageDataDto)
  data: ExchangeOpenOrderMessageDataDto
}
