import {
  BasePaginationDto,
  BasePaginationQueryDto,
} from '@app/common/base-pagination.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export enum STATUS_SETTING {
  ENABLE = 1,
  DISABLE = 2,
}

export class FuturesSetting {
  @Expose()
  @ApiProperty({ type: String })
  coin: string

  @Expose()
  @ApiProperty({ type: String })
  currency: string

  @Expose({ name: 'pair_name' })
  @ApiProperty({ type: String, name: 'pair_name' })
  pairName?: string

  /**
   * Crawler
   */
  @Expose({ name: 'crawler_external_price_scale' })
  @ApiProperty({ type: String, name: 'crawler_external_price_scale' })
  crawlerExternalPriceScale: string

  @Expose({ name: 'crawler_external_amount_scale' })
  @ApiProperty({ type: String, name: 'crawler_external_amount_scale' })
  crawlerExternalAmountScale: string

  @Expose({ name: 'crawler_adjustment_rate' })
  @ApiProperty({ type: String, name: 'crawler_adjustment_rate' })
  crawlerAdjustmentRate: string

  @Expose({ name: 'crawler_min_amount' })
  @ApiProperty({ type: String, name: 'crawler_min_amount' })
  crawlerMinAmount: string

  /**
   * OrderBook
   */
  @Expose({ name: 'ob_external_limit_orders' })
  @ApiProperty({ type: String, name: 'ob_external_limit_orders' })
  obExternalLimitOrders: string

  @Expose({ name: 'ob_external_max_amount' })
  @ApiProperty({ type: String, name: 'ob_external_max_amount' })
  obExternalMaxAmount: string

  @Expose({ name: 'ob_external_min_amount' })
  @ApiProperty({ type: String, name: 'ob_external_min_amount' })
  obExternalMinAmount: string

  @Expose({ name: 'ob_default_price_scale' })
  @ApiProperty({ type: String, name: 'ob_default_price_scale' })
  obDefaultPriceScale: string

  @Expose({ name: 'ob_list_price_scale' })
  @ApiProperty({ type: String, name: 'ob_list_price_scale' })
  obListPriceScale: string[]

  @Expose({ name: 'ob_amount_scale' })
  @ApiProperty({ type: String, name: 'ob_amount_scale' })
  obAmountScale: string

  @Expose({ name: 'ob_min_total' })
  @ApiProperty({ type: String, name: 'ob_min_total' })
  obMinTotal: string

  @Expose({ name: 'ob_max_total' })
  @ApiProperty({ type: String, name: 'ob_max_total' })
  obMaxTotal: string

  /**
   * Fee
   */
  @Expose({ name: 'order_fee_rate' })
  @ApiProperty({ type: String, name: 'order_fee_rate' })
  orderFeeRate: string

  @Expose({ name: 'insurance_fee_rate' })
  @ApiProperty({ type: String, name: 'insurance_fee_rate' })
  insuranceFeeRate: string

  @Expose({ name: 'position_fee_rate' })
  @ApiProperty({ type: String, name: 'position_fee_rate' })
  positionFeeRate: string

  @Expose({ name: 'margin_fee_rate' })
  @ApiProperty({ type: String, name: 'margin_fee_rate' })
  marginFeeRate: string

  @Expose({ name: 'maintenance_margin_rate' })
  @ApiProperty({ type: String, name: 'maintenance_margin_rate' })
  maintenanceMarginRate: string

  @Expose({ name: 'funding_rate' })
  @ApiProperty({ type: String, name: 'funding_rate' })
  fundingRate: string

  /**
   * Mark Price
   */
  @Expose({ name: 'mark_price_threshold_adjustment' })
  @ApiProperty({ type: String, name: 'mark_price_threshold_adjustment' })
  markPriceThresholdAdjustment: string

  @Expose({ name: 'mark_price_random_oscillation' })
  @ApiProperty({ type: String, name: 'mark_price_random_oscillation' })
  markPriceRandomOscillation: string

  @Expose({ name: 'mark_price_avg_time' })
  @ApiProperty({ type: String, name: 'mark_price_avg_time' })
  markPriceAvgTime: string

  /**
   * Trading
   */
  @Expose({ name: 'trading_max_amount' })
  @ApiProperty({ type: String, name: 'trading_max_amount' })
  tradingMaxAmount: string

  @Expose({ name: 'trading_min_amount' })
  @ApiProperty({ type: String, name: 'trading_min_amount' })
  tradingMinAmount: string

  @Expose({ name: 'trading_max_total' })
  @ApiProperty({ type: String, name: 'trading_max_total' })
  tradingMaxTotal: string

  @Expose({ name: 'trading_min_total' })
  @ApiProperty({ type: String, name: 'trading_min_total' })
  tradingMinTotal: string

  @Expose({ name: 'trading_price_scale' })
  @ApiProperty({ type: String, name: 'trading_price_scale' })
  tradingPriceScale: string

  @Expose({ name: 'trading_amount_scale' })
  @ApiProperty({ type: String, name: 'trading_amount_scale' })
  tradingAmountScale: string

  @Expose({ name: 'trading_list_leverage' })
  @ApiProperty({ type: Array, name: 'trading_list_leverage' })
  tradingListLeverage: string[]

  @Expose({ name: 'trading_max_margin_by_leverage' })
  @ApiProperty({ type: Array, name: 'trading_max_margin_by_leverage' })
  tradingMaxMarginByLeverage: Record<string, string>[]

  @Expose({ name: 'trading_min_short_rate' })
  @ApiProperty({ type: String, name: 'trading_min_short_rate' })
  tradingMinShortRate: string

  @Expose({ name: 'trading_max_long_rate' })
  @ApiProperty({ type: String, name: 'trading_max_long_rate' })
  tradingMaxLongRate: string

  /**
   * Other property
   */
  @Expose()
  @ApiProperty({
    type: Number,
    default: STATUS_SETTING.ENABLE,
  })
  status: number
}

export class SettingResponse extends BasePaginationDto<FuturesSetting[]> {
  @ApiProperty({ name: 'data', type: [FuturesSetting] })
  @Type(() => FuturesSetting)
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: FuturesSetting[] = []
}

export class SingleSettingResponse {
  @ApiProperty({ name: 'data', type: FuturesSetting })
  @Type(() => FuturesSetting)
  @Expose({ name: 'data' })
  data: FuturesSetting
}

export class IGetFuturesSettingDto extends BasePaginationQueryDto {}

export class IGetSingleSettingDto {
  @ApiProperty({ type: String })
  @Expose()
  coin: string

  @ApiProperty({ type: String })
  @Expose()
  currency: string
}

export class IDeleteSettingDto extends IGetSingleSettingDto {}

export class ODeleteSettingResponse {
  @ApiProperty({ type: Number })
  @Expose()
  deleted: number
}

export class IUpdateStatusDto {
  @ApiProperty({ name: 'status_pairs', type: {} })
  @Expose({ name: 'status_pairs' })
  statusPairs: Record<string, number>
}

export class OUpdateSettingResponse {
  @ApiProperty({ type: Number })
  @Expose()
  updated: number
}
