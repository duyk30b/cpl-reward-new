import { currentMilliTime } from '@app/common'
import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator'
import { ALL_STATUS_FOR_FE, ORDER_CLASS, ORDER_TYPE } from '../enums'

export enum ORDER_SEARCH_KEY {
  ORDER_ID = 'order_id',
  EMAIL = 'email',
  ALL = 'all',
}

export class BaseOrderQueryDto extends BasePaginationQueryDto {
  @Expose()
  @ApiPropertyOptional({
    name: 'from',
    example: currentMilliTime(),
    nullable: true,
    description: 'from date',
  })
  @IsNumberString()
  @ValidateIf((o) => o.to)
  @IsNotEmpty()
  from?: string

  @Expose()
  @ApiPropertyOptional({
    name: 'to',
    example: currentMilliTime(),
    nullable: true,
    description: 'to date',
  })
  @IsNumberString()
  @ValidateIf((o) => o.from)
  @IsNotEmpty()
  to?: string

  @Expose({ name: 'order_type' })
  @ApiPropertyOptional({
    description: 'Buy -> 1, Sell -> 2',
    name: 'order_type',
    example: ORDER_TYPE.Buy,
    nullable: true,
    enum: Object.values(ORDER_TYPE).filter(
      (value) => typeof value === 'number',
    ),
  })
  @IsEnum(ORDER_TYPE)
  @Type(() => Number)
  @IsOptional()
  orderType?: ORDER_TYPE

  @Expose({ name: 'order_class' })
  @ApiPropertyOptional({
    description: 'Market -> 1, Limit -> 2, StopMarket -> 3, StopLimit -> 4',
    name: 'order_class',
    example: ORDER_CLASS.Limit,
    nullable: true,
    enum: Object.values(ORDER_CLASS).filter(
      (value) => typeof value === 'number',
    ),
  })
  @IsEnum(ORDER_CLASS)
  @Type(() => Number)
  @IsOptional()
  orderClass?: ORDER_CLASS

  @Expose()
  @ApiPropertyOptional({
    name: 'coin',
    example: 'btc',
    nullable: true,
  })
  @ValidateIf((o) => o.currency)
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase() ?? value)
  coin?: string

  @Expose()
  @ApiPropertyOptional({
    name: 'currency',
    example: 'usdt',
    nullable: true,
  })
  @ValidateIf((o) => o.coin)
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase() ?? value)
  currency?: string

  @Expose({ name: 'sort_by' })
  @ApiPropertyOptional({ name: 'sort_by', example: 'order_id' })
  @IsString()
  @IsOptional()
  sortBy?: string

  @ApiPropertyOptional({ name: 'keyword' })
  @Expose({ name: 'keyword' })
  @IsString()
  @IsOptional()
  keyword?: string

  @ApiPropertyOptional({ name: 'search_by_field' })
  @Expose({ name: 'search_by_field' })
  @IsEnum(ORDER_SEARCH_KEY)
  @IsOptional()
  searchByField?: string
}

export class BaseOrderDto {
  @Expose({ name: 'create_time', toPlainOnly: true })
  @ApiProperty({ name: 'create_time', example: currentMilliTime() })
  @IsNumberString()
  @IsNotEmpty()
  createTime: string

  @Expose()
  @ApiProperty()
  coin: string

  @Expose()
  @ApiProperty()
  currency: string

  @Expose()
  @ApiProperty()
  price: string

  @Expose()
  @ApiProperty()
  @IsNumberString()
  volume: string

  @Expose({ name: 'user_id', toPlainOnly: true })
  @ApiProperty({ name: 'user_id' })
  userId: string // TODO: just temporary, need to replace by email

  @Expose({ name: 'order_id', toPlainOnly: true })
  @ApiProperty({ name: 'order_id' })
  orderId: string

  @Expose({ name: 'order_type', toPlainOnly: true })
  @ApiProperty({ name: 'order_type' })
  @IsEnum(ORDER_TYPE)
  @Type(() => Number)
  orderType: ORDER_TYPE

  @Expose({ name: 'order_class', toPlainOnly: true })
  @ApiProperty({ name: 'order_class' })
  @IsEnum(ORDER_CLASS)
  @Type(() => Number)
  orderClass: ORDER_CLASS

  @Expose()
  @ApiProperty({
    enum: Object.values(ALL_STATUS_FOR_FE).filter(
      (value) => typeof value === 'number',
    ),
  })
  @IsEnum(ALL_STATUS_FOR_FE)
  @Type(() => Number)
  status: number

  @Expose({ name: 'error_count', toPlainOnly: true })
  @IsNumber()
  errorCount: number
}
