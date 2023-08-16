import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ALL_STATUS_FOR_FE, ORDER_STATUS } from '../enums'
import { BaseOrderDto, BaseOrderQueryDto } from './base-order.dto'

export enum CANCEL_RESOURCE {
  UNDEFINED = 0,
  USER = 1,
  ADMIN = 2,
  SYSTEM = 3,
}

export class GetOrderHistoryQueryDto extends BaseOrderQueryDto {
  @Expose()
  @ApiPropertyOptional({
    description:
      'Pending -> 1, Filled -> 2, Canceled -> 3, Error -> 4, PartialFilled -> 5, ProcessingCancel -> 6, PartialFill -> 7',
    name: 'status',
    example: `${ORDER_STATUS.Canceled},${ORDER_STATUS.Filled},${ORDER_STATUS.Pending}`,
    nullable: true,
    enum: Object.values(ALL_STATUS_FOR_FE).filter(
      (value) => typeof value === 'number',
    ) as any,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        ?.trim()
        .split(',')
        .map((status) => Number(status))
    } else if (typeof value === 'number') {
      return [value]
    }
    return value
  })
  @IsIn(
    [
      ALL_STATUS_FOR_FE.Canceled,
      ALL_STATUS_FOR_FE.Filled,
      ALL_STATUS_FOR_FE.Pending,
      ALL_STATUS_FOR_FE.ProcessingCancel,
      ALL_STATUS_FOR_FE.PartialFilled,
      ALL_STATUS_FOR_FE.PartialFill,
      ALL_STATUS_FOR_FE.Error,
      ALL_STATUS_FOR_FE.Stopping,
    ],
    { each: true },
  )
  @IsOptional()
  status?: number[]

  @Expose()
  @ApiPropertyOptional({
    description: 'ADMIN -> 2, USER -> 1, SYSTEM -> 3, UNDEFINED -> 0',
    name: 'resources',
    example: `${CANCEL_RESOURCE.ADMIN},${CANCEL_RESOURCE.SYSTEM}`,
    nullable: true,
    enum: Object.values(CANCEL_RESOURCE).filter(
      (value) => typeof value === 'number',
    ) as any,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        ?.trim()
        .split(',')
        .map((status) => Number(status))
    } else if (typeof value === 'number') {
      return [value]
    }
    return value
  })
  @IsIn([CANCEL_RESOURCE.ADMIN, CANCEL_RESOURCE.SYSTEM], {
    each: true,
  })
  @IsOptional()
  resources?: CANCEL_RESOURCE[]
}

export class FeeOrderHistoryDto {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string
}

export class CancelledDto {
  @Expose({ name: 'resource' })
  @IsEnum(CANCEL_RESOURCE)
  cancelResource: CANCEL_RESOURCE

  @Expose({ name: 'id' })
  @IsNumberString()
  cancellerId: string
}

export class OrderHistoryItemDto extends BaseOrderDto {
  @Expose({ name: 'filled_price', toPlainOnly: true })
  @ApiProperty({ name: 'filled_price' })
  @IsNumberString()
  filledPrice: string

  @Expose({ name: 'stop_price', toPlainOnly: true })
  @ApiProperty({ name: 'stop_price' })
  @IsNumberString()
  stopPrice: string

  @Expose({ name: 'filled_volume', toPlainOnly: true })
  @ApiProperty({ name: 'filled_volume' })
  @IsNumberString()
  filledVolume: string

  @Expose({ toPlainOnly: true })
  @ApiProperty({ name: 'fee', type: [FeeOrderHistoryDto] })
  @IsArray()
  @IsNotEmpty()
  @Type(() => FeeOrderHistoryDto)
  @ValidateNested({ each: true })
  fee: FeeOrderHistoryDto[] = []

  @Expose({ name: 'stop_direction', toPlainOnly: true })
  @ApiProperty({ name: 'stop_direction' })
  @IsNumber()
  stopDirection: number

  @ApiProperty({ name: 'email' })
  @Expose()
  @Type(() => String)
  email: string

  @Expose()
  @IsOptional()
  @Type(() => CancelledDto)
  cancelled: CancelledDto
}

export class GrpcOrderHistoryPaginationResponse extends BasePaginationDto<
  OrderHistoryItemDto[]
> {
  @ApiProperty({ name: 'data', type: [OrderHistoryItemDto] })
  @Type(() => OrderHistoryItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose()
  data: OrderHistoryItemDto[] = []
}
