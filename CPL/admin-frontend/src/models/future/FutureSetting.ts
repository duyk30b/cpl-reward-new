import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class FutureSetting {
  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose({ name: 'pair_name' })
  pairName?: string

  /**
   * Crawler
   */
  @Expose({ name: 'crawler_external_price_scale' })
  crawlerExternalPriceScale: string

  @Expose({ name: 'crawler_external_amount_scale' })
  crawlerExternalAmountScale: string

  @Expose({ name: 'crawler_adjustment_rate' })
  crawlerAdjustmentRate: string

  @Expose({ name: 'crawler_min_amount' })
  crawlerMinAmount: string

  /**
   * OrderBook
   */
  @Expose({ name: 'ob_external_limit_orders' })
  obExternalLimitOrders: string

  @Expose({ name: 'ob_external_max_amount' })
  obExternalMaxAmount: string

  @Expose({ name: 'ob_external_min_amount' })
  obExternalMinAmount: string

  @Expose({ name: 'ob_default_price_scale' })
  obDefaultPriceScale: string

  @Expose({ name: 'ob_list_price_scale' })
  obListPriceScale: string[] = []

  @Expose({ name: 'ob_amount_scale' })
  obAmountScale: string

  @Expose({ name: 'ob_min_total' })
  obMinTotal: string

  @Expose({ name: 'ob_max_total' })
  obMaxTotal: string

  /**
   * Fee
   */
  @Expose({ name: 'order_fee_rate' })
  orderFeeRate: string

  @Expose({ name: 'insurance_fee_rate' })
  insuranceFeeRate: string

  @Expose({ name: 'position_fee_rate' })
  positionFeeRate: string

  @Expose({ name: 'margin_fee_rate' })
  marginFeeRate: string

  @Expose({ name: 'maintenance_margin_rate' })
  maintenanceMarginRate: string

  @Expose({ name: 'funding_rate' })
  fundingRate: string

  /**
   * Mark Price
   */
  @Expose({ name: 'mark_price_threshold_adjustment' })
  markPriceThresholdAdjustment: string

  @Expose({ name: 'mark_price_random_oscillation' })
  markPriceRandomOscillation: string

  @Expose({ name: 'mark_price_avg_time' })
  markPriceAvgTime: string

  /**
   * Trading
   */
  @Expose({ name: 'trading_max_amount' })
  tradingMaxAmount: string

  @Expose({ name: 'trading_min_amount' })
  tradingMinAmount: string

  @Expose({ name: 'trading_max_total' })
  tradingMaxTotal: string

  @Expose({ name: 'trading_min_total' })
  tradingMinTotal: string

  @Expose({ name: 'trading_price_scale' })
  tradingPriceScale: string

  @Expose({ name: 'trading_amount_scale' })
  tradingAmountScale: string

  @Expose({ name: 'trading_list_leverage' })
  tradingListLeverage: string[] = []

  @Expose({ name: 'trading_max_margin_by_leverage' })
  tradingMaxMarginByLeverage: Record<string, string> = {}

  @Expose({ name: 'trading_min_short_rate' })
  tradingMinShortRate: string

  @Expose({ name: 'trading_max_long_rate' })
  tradingMaxLongRate: string

  /**
   * Other property
   */
  @Expose()
  status: number
}

export const ExternalScaleList = [
  { key: '1', value: '1' },
  { key: '2', value: '2' },
  { key: '3', value: '3' },
  { key: '4', value: '4' },
  { key: '5', value: '5' },
  { key: '6', value: '6' },
  { key: '7', value: '7' },
  { key: '8', value: '8' },
]

export const PriceScaleOptions = [
  { key: '0', value: '1' },
  { key: '1', value: '0.1' },
  { key: '2', value: '0.01' },
  { key: '3', value: '0.001' },
  { key: '4', value: '0.0001' },
  { key: '5', value: '0.00001' },
  { key: '6', value: '0.000001' },
  { key: '7', value: '0.0000001' },
  { key: '8', value: '0.00000001' },
  { key: '9', value: '0.000000001' },
  { key: '10', value: '0.0000000001' },
]

export const LeverageOptions = [
  { key: '1', value: '1' },
  { key: '2', value: '2' },
  { key: '3', value: '3' },
  { key: '5', value: '5' },
  { key: '10', value: '10' },
  { key: '20', value: '20' },
  { key: '25', value: '25' },
  { key: '50', value: '50' },
  { key: '75', value: '75' },
  { key: '100', value: '100' },
]
