import { Exclude, Expose } from 'class-transformer'

export class PairOBMDataParam {
  module: string
  exchange: string
  coin?: string
  currency?: string
}

export class DeletePairItem {
  exchange: string
  coin: string
  currency: string
}

export class PropertyItem {
  [key: string]: string | number
}

export class PropertyShow {
  [key: string]: PropertyItem
}

@Exclude()
export class ObmBotASetting {
  @Expose()
  min_amount? = '10'

  @Expose()
  max_amount? = '20'

  @Expose()
  min_total? = '10'

  @Expose()
  max_total? = '20'
}

@Exclude()
export class ObmBotPSetting {
  @Expose()
  action? = 1

  @Expose()
  volume_scale? = 0.1

  @Expose()
  min_total? = '10'

  @Expose()
  max_total? = '20'

  @Expose()
  min_amount? = '10'

  @Expose()
  max_amount? = '20'

  @Expose()
  order_period? = 12

  @Expose()
  skip_min_amount_rate? = '0.5'
}

@Exclude()
export class ObmCrawlerSetting {
  @Expose()
  adjustment_rate? = 0.1

  @Expose()
  commission_fee? = 0.1

  @Expose()
  round_digits? = 2
}

@Exclude()
export class ObmMergeOrderbookSetting {
  @Expose()
  default_precision? = '0.01'

  @Expose()
  precisions? = ['0.01']

  @Expose()
  min_amount? = '10'

  @Expose()
  max_amount? = '20'

  @Expose()
  decimal? = 2

  @Expose()
  limit_order? = 100

  @Expose()
  threshold_price_buy? = 50

  @Expose()
  threshold_price_sell? = 100

  @Expose()
  threshold_volume_buy? = '10'

  @Expose()
  threshold_volume_sell? = '20'
}

@Exclude()
export class ObmNotificationThresholdSetting {
  @Expose()
  min? = '10000'

  @Expose()
  max? = '20000'
}

export class ObmPairSettingItemDTO {
  @Expose()
  coin = ''

  @Expose()
  currency = ''

  @Expose()
  exchange? = ''

  @Expose()
  exchange_priority?: number = NaN

  @Expose()
  status? = 2

  @Expose()
  bot_a?: ObmBotASetting

  @Expose()
  bot_p?: ObmBotPSetting

  @Expose()
  crawler?: ObmCrawlerSetting

  @Expose()
  merge_orderbook?: ObmMergeOrderbookSetting

  @Expose()
  notification_threshold?: ObmNotificationThresholdSetting

  @Expose()
  update_by: string
}

export class ObmPairSettingDTO {
  @Expose()
  name = 'obm_pair_setting'

  @Expose()
  data: ObmPairSettingItemDTO[]
}

@Exclude()
export class BalanceSetting {
  @Expose()
  token: string

  @Expose()
  alert? = '100'

  @Expose()
  stop? = '10'

  @Expose({ name: 'adjust_balance_percent' })
  adjustBalancePercent? = '10'
}

@Exclude()
export class ObmExchangeSettingItemDTO {
  @Expose()
  id?: string

  @Expose()
  exchange: string

  @Expose()
  status?: number

  @Expose()
  update_by: string

  @Expose()
  balances?: BalanceSetting[]
}

export class ObmExchangeSettingDTO {
  @Expose()
  name = 'obm_pair_setting'

  @Expose()
  data: ObmExchangeSettingItemDTO[]
}

export interface PropertySetting {
  name: string
  value: string
  type: string
}

export interface PairThresholdItem {
  min: PropertySetting
  max: PropertySetting
}

export interface PairThreshold {
  [key: string]: PairThresholdItem
}
