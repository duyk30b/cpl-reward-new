import {
  BasePaginationDto,
  BasePaginationQueryDto,
} from '@app/common/base-pagination.dto'
import { Expose, Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { TransformInt } from '@lib/util'

export class OrderId {
  @ApiProperty({ name: 'data', type: [String] })
  @Type(() => String)
  @Expose({ name: 'id' })
  id: string[] = []
}

export class CancelOrderResponse {
  @ApiProperty({ name: 'data', type: OrderId })
  @Type(() => OrderId)
  @Expose({ name: 'data' })
  data: OrderId
}

export class CancelOrderRequest {
  @Expose({ name: 'order_id' })
  @ApiPropertyOptional({ name: 'order_id', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  orderId: string[]
}

export class SearchOrderRequest extends BasePaginationQueryDto {
  @Expose({ name: 'coin' })
  @ApiPropertyOptional({ name: 'coin', type: String })
  @IsString()
  @IsOptional()
  coin?: string

  @Expose({ name: 'currency' })
  @ApiPropertyOptional({ name: 'currency', type: String })
  @IsString()
  @IsOptional()
  currency?: string

  @Expose({ name: 'order_type' })
  @ApiPropertyOptional({ name: 'order_type', type: Number })
  @IsNumber()
  @IsOptional()
  @TransformInt()
  orderType?: number

  @Expose({ name: 'order_mode' })
  @ApiPropertyOptional({ name: 'order_mode', type: Number })
  @IsNumber()
  @IsOptional()
  @TransformInt()
  orderMode?: number

  @Expose({ name: 'order_side' })
  @ApiPropertyOptional({ name: 'order_side', type: Number })
  @IsNumber()
  @IsOptional()
  @TransformInt()
  orderSide?: number

  @Expose({ name: 'order_status' })
  @ApiPropertyOptional({ name: 'order_status', type: [Number] })
  @IsArray()
  @IsOptional()
  orderStatus?: number[]

  @Expose({ name: 'order_id' })
  @ApiPropertyOptional({ name: 'order_id', type: String })
  @IsString()
  @IsOptional()
  orderId?: string

  @Expose({ name: 'user_id' })
  @ApiPropertyOptional({ name: 'user_id', type: String })
  @IsString()
  @IsOptional()
  userId?: string

  @Expose({ name: 'user_type' })
  @ApiPropertyOptional({ name: 'user_type', type: String })
  @IsString()
  @IsOptional()
  userType?: string

  @Expose({ name: 'from' })
  @ApiPropertyOptional({ name: 'from', type: String })
  @IsString()
  @IsOptional()
  from?: string

  @Expose({ name: 'to' })
  @ApiPropertyOptional({ name: 'to', type: String })
  @IsString()
  @IsOptional()
  to?: string

  @Expose({ name: 'position_id' })
  @ApiPropertyOptional({ name: 'position_id' })
  @IsString()
  @IsOptional()
  positionId?: string

  @Expose({ name: 'sort_by' })
  @ApiPropertyOptional({ name: 'sort_by', example: 'order_id' })
  @IsString()
  @IsOptional()
  sortBy?: string
}

export class Order {
  @Expose()
  @ApiProperty({ type: String })
  id: string

  @Expose()
  @ApiProperty({ type: String })
  price: string

  @Expose()
  @ApiProperty({ type: String })
  volume: string

  @Expose()
  @ApiProperty({ type: Number })
  leverage: number

  @Expose()
  @ApiProperty({ type: Number })
  side: number

  @Expose()
  @ApiProperty({ type: Number })
  type: number

  @Expose()
  @ApiProperty({ type: Number })
  status: number

  @Expose({ name: 'user_type' })
  @ApiProperty({ type: Number, name: 'user_type' })
  userType: number

  @Expose()
  @ApiProperty({ type: String })
  coin: string

  @Expose()
  @ApiProperty({ type: String })
  currency: string

  @Expose({ name: 'addition_margin' })
  @ApiProperty({ type: String, name: 'addition_margin' })
  additionMargin: string

  @Expose()
  @ApiProperty({ type: String })
  margin: string

  @Expose()
  @ApiProperty({ type: String })
  fee: string

  @Expose()
  @ApiProperty({ type: String })
  collateral: string

  @Expose({ name: 'user_id' })
  @ApiProperty({ type: String, name: 'user_id' })
  userId: string

  @Expose()
  @ApiProperty({ type: Number })
  mode: number

  @Expose({ name: 'position_id' })
  @ApiProperty({ type: String, name: 'position_id' })
  positionId: string

  @Expose({ name: 'create_time' })
  @ApiProperty({ type: String, name: 'create_time' })
  createTime: string

  @Expose({ name: 'update_time' })
  @ApiProperty({ type: String, name: 'update_time' })
  updateTime: string

  @Expose()
  @ApiProperty({ type: String })
  email?: string

  @Expose({ name: 'matching_price' })
  @ApiProperty({ type: String, name: 'matching_price' })
  matchingPrice: string

  @Expose()
  @ApiProperty({ type: String })
  pnl: string
}

export class OrderData extends BasePaginationDto<Order[]> {
  @ApiProperty({ name: 'data', type: [Order] })
  @Type(() => Order)
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: Order[] = []
}
