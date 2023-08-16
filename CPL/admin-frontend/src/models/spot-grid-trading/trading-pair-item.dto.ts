import { PAIR_STATUS } from '@/core/variables/common.enum'
import { Expose, Transform, Type } from 'class-transformer'
import {
  BasePaginationQueryDto,
  ResponsePaginationDto,
} from '../common/response-pagination.dto'

export class GetGridTradingPaginationDto extends BasePaginationQueryDto {
  @Expose({ name: 'coin' })
  @Type(() => String)
  @Transform(({ value }) => (value as string)?.toLowerCase() || undefined)
  coin?: string

  @Expose({ name: 'currency' })
  @Type(() => String)
  @Transform(({ value }) => (value as string)?.toLowerCase() || undefined)
  currency?: string

  @Expose({ name: 'status' })
  @Type(() => Number)
  status?: PAIR_STATUS
}

export abstract class BasePairItemDto {
  @Type(() => String)
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @Expose({ name: 'coin' })
  coin: string

  @Type(() => String)
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @Expose({ name: 'currency' })
  currency: string
}

export class TradingPairItemDto extends BasePairItemDto {
  @Expose({ name: 'id' })
  @Type(() => String)
  id: string

  @Expose({ name: 'created_at' })
  @Type(() => String)
  createdAt: string

  @Expose({ name: 'updated_at' })
  @Type(() => String)
  updatedAt: string

  @Expose({ name: 'profit_sharing' })
  @Type(() => String)
  profitSharing: string

  @Expose({ name: 'max_grid' })
  @Type(() => Number)
  maxGrid: number

  @Expose({ name: 'min_grid' })
  @Type(() => Number)
  minGrid: number

  @Expose({ name: 'threshold_higher_price' })
  @Type(() => String)
  thresholdHigherPrice: string

  @Expose({ name: 'threshold_lower_price' })
  @Type(() => String)
  thresholdLowerPrice: string

  @Expose({ name: 'adjust_coefficient' })
  @Type(() => String)
  adjustCoefficient: string

  @Expose({ name: 'status' })
  status: PAIR_STATUS

  @Expose()
  index: number
}

export class GetGridTradingPairResponseDto extends ResponsePaginationDto {
  @Expose()
  @Type(() => TradingPairItemDto)
  data: TradingPairItemDto[]
}

export class DeleteGridTradingResponseDto {
  @Expose({ name: 'status' })
  @Type(() => Number)
  status: number
}

export class BaseGridTradingItemDto extends BasePairItemDto {
  @Expose({ name: 'status' })
  status: PAIR_STATUS

  @Expose({ name: 'profit_sharing' })
  @Type(() => String)
  profitSharing: string

  @Expose({ name: 'max_grid' })
  @Type(() => Number)
  maxGrid: number

  @Expose({ name: 'min_grid' })
  @Type(() => Number)
  minGrid: number

  @Expose({ name: 'threshold_higher_price' })
  @Type(() => String)
  thresholdHigherPrice: string

  @Expose({ name: 'threshold_lower_price' })
  @Type(() => String)
  thresholdLowerPrice: string

  @Expose({ name: 'adjust_coefficient' })
  @Type(() => String)
  adjustCoefficient: string

  @Expose()
  index: number
}

export class UpdateGridTradingItemDto extends BaseGridTradingItemDto {}

export class CreateGridTradingItemDto extends BaseGridTradingItemDto {}

export class UpdateOrderOfPairResponse extends DeleteGridTradingResponseDto {}

class OrderOfPairRequest {
  @Expose({ name: 'id' })
  id: string

  @Type(() => Number)
  @Expose({ name: 'index' })
  index: number
}

export class UpdateOrderOfPairRequestDto {
  @Expose()
  @Type(() => OrderOfPairRequest)
  data: OrderOfPairRequest[]
}

export class GetAllPairNameOfGridResponseDto {
  @Expose()
  @Type(() => BasePairItemDto)
  data: BasePairItemDto[]
}
