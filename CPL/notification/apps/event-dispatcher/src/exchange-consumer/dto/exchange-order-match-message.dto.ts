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

class DataOrderOriginDto {
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

  @Expose({ name: 'filled_price' })
  filledPrice: string

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

class DataOrderMatchDto extends DataOrderOriginDto {}

export type DataOrderSideDto = DataOrderMatchDto | DataOrderOriginDto

class DataOrderDto {
  @Expose()
  @ValidateNested()
  @Type(() => DataOrderOriginDto)
  origin: DataOrderOriginDto

  @Expose()
  @ValidateNested()
  @Type(() => DataOrderMatchDto)
  match: DataOrderMatchDto
}

export class ExchangeOrderMatchMessageDataDto {
  @Expose()
  @ValidateNested()
  @Type(() => DataOrderDto)
  order: DataOrderDto
}

export class ExchangeOrderMatchMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => ExchangeOrderMatchMessageDataDto)
  data: ExchangeOrderMatchMessageDataDto
}
