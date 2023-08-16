import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import { Expose, Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { FuturePaginationDto } from './futures-core-pagination.dto'
import { TransformInt } from '@lib/util'

export class GetPositionListRequest extends BasePaginationQueryDto {
  @Expose({ name: 'user_id' })
  @ApiPropertyOptional({ name: 'user_id', type: [String] })
  @IsArray()
  @IsOptional()
  userId?: string[]

  @Expose()
  @ApiPropertyOptional({ type: [String], example: "['btc/usdt']" })
  @IsArray()
  @IsOptional()
  symbols?: string[]

  @Expose()
  @ApiPropertyOptional({ type: [String], example: "['open', 'close']" })
  @IsArray()
  @IsOptional()
  status?: string[]

  @Expose()
  @ApiPropertyOptional({ type: Number, example: '0 / 1' })
  @IsOptional()
  @TransformInt()
  side?: string

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

  @Expose({ name: 'order_by' })
  @ApiPropertyOptional({
    type: [Number],
    example: '[0,1,2,3,4]',
    name: 'order_by',
  })
  @IsArray()
  @IsOptional()
  orderBy?: number[]
}

export class Position {
  @Expose()
  @ApiProperty({ type: String })
  id: string

  @Expose({ name: 'user_id' })
  @ApiProperty({ type: String, name: 'user_id' })
  userId: string

  @Expose()
  @ApiProperty({ type: String })
  symbol: string

  @Expose({ name: 'entry_price' })
  @ApiProperty({ type: String, name: 'entry_price' })
  entryPrice: string

  @Expose()
  @ApiProperty({ type: String })
  leverage: string

  @Expose()
  @ApiProperty({ type: String })
  margin: string

  @Expose({ name: 'initial_margin' })
  @ApiProperty({ type: String, name: 'initial_margin' })
  initialMargin: string

  @Expose()
  @ApiProperty({ type: String })
  size: string

  @Expose()
  @ApiProperty({ type: String })
  side: string

  @Expose({ name: 'position_type' })
  @ApiProperty({ type: String, name: 'position_type' })
  positionType: string

  @Expose()
  @ApiProperty({ type: String })
  status: string

  @Expose({ name: 'take_profit_price' })
  @ApiProperty({ type: String, name: 'take_profit_price' })
  takeProfitPrice: string

  @Expose({ name: 'stop_loss_price' })
  @ApiProperty({ type: String, name: 'stop_loss_price' })
  stopLossPrice: string

  @Expose({ name: 'liquidation_price' })
  @ApiProperty({ type: String, name: 'liquidation_price' })
  liquidationPrice: string

  @Expose({ name: 'unrealized_pnl' })
  @ApiProperty({ type: String, name: 'unrealized_pnl' })
  unrealizedPnl: string

  @Expose({ name: 'mark_price' })
  @ApiProperty({ type: String, name: 'mark_price' })
  markPrice: string

  @Expose({ name: 'created_at' })
  @ApiProperty({ type: String, name: 'created_at' })
  createdAt: string

  @Expose({ name: 'updated_at' })
  @ApiProperty({ type: String, name: 'updated_at' })
  updatedAt: string

  @Expose()
  @ApiProperty({ type: String })
  email?: string
}

export class GetPositionListResponse extends FuturePaginationDto<Position[]> {
  @ApiProperty({ name: 'positions', type: [Position] })
  @Type(() => Position)
  @ValidateNested({ each: true })
  @Expose({ name: 'positions' })
  positions: Position[] = []
}
