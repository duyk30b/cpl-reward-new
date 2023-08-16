import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { ORDER_TYPE, USER_TYPE } from '../enums'
import { BaseOrderDto, BaseOrderQueryDto } from './base-order.dto'

export class GetOpenOrderQueryDto extends BaseOrderQueryDto {
  @ApiPropertyOptional({
    name: 'user_type',
    example: '1',
    type: Number,
    enum: Object.values(USER_TYPE).filter((value) => typeof value === 'number'),
  })
  @Expose({ name: 'user_type' })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(USER_TYPE)
  userType?: USER_TYPE

  @ApiPropertyOptional({ name: 'orderbook_price', type: String })
  @Expose({ name: 'orderbook_price' })
  @ValidateIf((o) => o.orderbookType)
  @IsNumberString()
  @IsNotEmpty()
  orderbookPrice?: string

  @ApiPropertyOptional({
    name: 'orderbook_type',
    description: 'Buy -> 1, Sell -> 2',
    example: ORDER_TYPE.Buy,
    nullable: true,
    enum: Object.values(ORDER_TYPE).filter(
      (value) => typeof value === 'number',
    ),
  })
  @Expose({ name: 'orderbook_type' })
  @ValidateIf((o) => o.orderbookPrice)
  @IsEnum(ORDER_TYPE)
  @IsNotEmpty()
  @Type(() => Number)
  orderbookType?: ORDER_TYPE
}

export class ExportOpenOrderRequestDto extends GetOpenOrderQueryDto {
  @Expose()
  @ApiProperty({
    name: 'email',
    example: `exchange@cryptopie-labo.com`,
    nullable: true,
  })
  @IsNotEmpty()
  email: string
}

export class OpenOrderItemDto extends BaseOrderDto {
  @ApiProperty({
    name: 'user_type',
    type: Number,
  })
  @Expose({ name: 'user_type', toPlainOnly: true })
  @IsNotEmpty()
  @IsIn(
    [USER_TYPE.USER, USER_TYPE.BOT_A, USER_TYPE.BOT_P, USER_TYPE.GATEKEEPER],
    {
      each: true,
    },
  )
  userType: number

  @ApiProperty({ name: 'email' })
  @Expose()
  @Type(() => String)
  email: string
}

export class GrpcOpenOrderPaginationResponse extends BasePaginationDto<
  OpenOrderItemDto[]
> {
  @ApiProperty({ name: 'data', type: [OpenOrderItemDto] })
  @Type(() => OpenOrderItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: OpenOrderItemDto[] = []
}

export class GrpcExportOpenOrderResponse {
  @ApiProperty({ name: 'status' })
  @ApiProperty({ name: 'status' })
  @Expose({ name: 'status' })
  status: boolean
}
