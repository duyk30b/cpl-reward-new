import { SortType } from '@app/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'

class BaseItemDto {
  @ApiProperty({
    name: 'coin',
    example: 'btc',
  })
  @Expose()
  @IsNotEmpty()
  @Transform(({ obj }) => obj.coin.toLowerCase(), { toClassOnly: true })
  coin: string

  @ApiProperty({
    name: 'currency',
    example: 'usdt',
  })
  @Expose()
  @IsNotEmpty()
  @Transform(({ obj }) => obj.currency.toLowerCase(), { toClassOnly: true })
  currency: string

  @ApiProperty({
    name: 'precision',
    example: '0.01',
  })
  @Expose()
  @IsNotEmpty()
  precision: string
}

export class GetOrderbookQueryDto extends BaseItemDto {
  @ApiPropertyOptional({
    name: 'take',
    example: 25,
    description: `number of elements in each array, default = 25`,
  })
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  take: number

  @ApiPropertyOptional({
    name: 'sort',
    enum: SortType,
    description: `order by: price, default = ${SortType.desc}`,
  })
  @Expose()
  @IsOptional()
  @IsEnum(SortType)
  sort: SortType
}
class OrderbookItemDto {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coin: string

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  precision: string

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: string

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  volume: string
}

class OrderbookDto {
  @ApiProperty({ type: [OrderbookItemDto] })
  @Expose()
  @Type(() => OrderbookItemDto)
  @ValidateNested({ each: true })
  asks: OrderbookItemDto[]

  @ApiProperty({ type: [OrderbookItemDto] })
  @Expose()
  @Type(() => OrderbookItemDto)
  @ValidateNested({ each: true })
  bids: OrderbookItemDto[]
}

class OrderbookDataDto extends BaseItemDto {
  @Expose()
  @ApiProperty({ type: OrderbookDto })
  @Type(() => OrderbookDto)
  @ValidateNested()
  orderbook: OrderbookDto

  @Expose({ name: 'current_price' })
  @ApiProperty({ name: 'current_price' })
  @IsNumberString()
  @IsNotEmpty()
  currentPrice: string
}

export class OrderbookResponseDto {
  @Expose()
  @ApiProperty({ type: OrderbookDataDto })
  @Type(() => OrderbookDataDto)
  @ValidateNested()
  data: OrderbookDataDto

  @Expose({ name: 'last_update', toPlainOnly: true })
  @ApiProperty({ name: 'last_update' })
  lastUpdate: string
}
