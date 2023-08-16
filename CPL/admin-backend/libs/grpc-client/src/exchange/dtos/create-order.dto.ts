import { Expose, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { ORDER_CLASS, ORDER_TYPE } from '../enums'
import { BaseOrderDto } from './base-order.dto'

export class CreateOrderRequestDto {
  @Expose({ name: 'order_type' })
  @IsEnum(ORDER_TYPE)
  @Type(() => Number)
  @IsNotEmpty()
  orderType?: ORDER_TYPE

  @Expose({ name: 'order_class' })
  @IsEnum(ORDER_CLASS)
  @Type(() => Number)
  @IsOptional()
  orderClass?: ORDER_CLASS

  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  price: string

  @Expose()
  volume: string

  @Expose({ name: 'user_id' })
  userId: string
}

export class CreateOrderResponse {
  @Expose()
  data: BaseOrderDto

  @Expose()
  status_code: number

  @Expose()
  timestamp: string

  @Expose()
  msg: string
}
