import { Exclude, Expose } from 'class-transformer'

export class DataPointParams {
  coin: string
  currency: string
  start_time: string
  end_time: string
}

export class DataPointItem {
  id?: string
  coin?: string
  currency?: string
  created_at?: string
  start_time: string
  end_time: string
  start_price: string
  end_price: string
}

export class DataPointResponse {
  version: string
  data_point: DataPointItem[]
}

@Exclude()
export class MarketMakerConfigSetting {
  @Expose()
  price_precision?: string = '0.01'

  @Expose()
  volume_precision?: string = '0.01'

  @Expose()
  min_total? = '15'

  @Expose()
  min_amount? = '0.15'

  @Expose()
  max_amount? = '1'

  @Expose()
  spread_price? = '0.5'

  @Expose()
  volume_scale? = '0.005'

  @Expose()
  order_count_package? = '4'

  @Expose()
  active_flag? = false

  @Expose()
  status? = 0
}

@Exclude()
export class MarketMakerSettingItem {
  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  configure?: MarketMakerConfigSetting
}

@Exclude()
export class MarketMakerSettingItemV2 extends MarketMakerSettingItem {
  @Expose()
  exchange: string
}

export class OrderInfor {
  key: string
  status: string
  side?: string
}

export class OrderPairProcess {
  inProcess: boolean
  createdBuyPercent: string
  createdBuyOrders: OrderInfor[]
  canceledBuyOrders: OrderInfor[]
  canceledBuyPercent: string
  createdSellPercent: string
  createdSellOrders: OrderInfor[]
  canceledSellOrders: OrderInfor[]
  canceledSellPercent: string
}

export class PairInfoMarketMaker {
  coin: string
  currency: string
}

export class GetMarketMakerSetting {
  coin: string
  currency: string
  exchange: string
}

export class MarketMakerSystemTargetParams {
  coin?: string
  currency?: string
  exchange?: string
}

@Exclude()
export class UpdateMakerMakerSettings {
  @Expose()
  data: MarketMakerSettingItem[]

  @Expose()
  name? = 'update_market_maker_settings'
}

@Exclude()
export class MarketMakerPair {
  @Expose()
  coin: string

  @Expose()
  currency: string
}
