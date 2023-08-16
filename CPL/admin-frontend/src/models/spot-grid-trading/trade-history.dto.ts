import { Expose, Type } from 'class-transformer'
import { ORDER_CLASS, ORDER_TYPE } from '../exchange-history/TradeHistory'

export class GetTradeHistorySummaryRequest {
  @Expose({ name: 'strategy_id' })
  strategyId: string

  @Expose({ name: 'user_id' })
  userId: string
}

export class GetTradeHistorySummaryResponse {
  @Expose({ name: 'total_matched_trade' })
  totalMatchedTrade: string

  @Expose({ name: 'start_price' })
  startPrice: string

  @Expose({ name: 'initial_buy_quantity' })
  initialBuyQuantity: string

  @Expose({ name: 'sell_quantity_at_stop' })
  sellQuantityAtStop?: string

  @Expose({ name: 'average_sell_price_at_stop' })
  averageSellPriceAtStop?: string

  @Expose({ name: 'stop_price' })
  stopPrice?: string

  @Expose({ name: 'grid_profit' })
  gridProfit: string
}

export class GetTradeHistoryRequestDto {
  @Expose({ name: 'strategy_id' })
  strategyId: string

  @Expose({ name: 'from' })
  from?: string

  @Expose({ name: 'to' })
  to?: string

  @Expose()
  take?: number = 25
}

export class LinkPaginationResponse {
  @Expose()
  next: string

  @Expose()
  prev: string
}

export class PaginationData {
  @Expose()
  page?: number

  @Expose()
  size?: number

  @Expose()
  total?: number
}

class TradeHistoryOrderInfoDto {
  @Expose({ name: 'avg_price' })
  avgPrice: string

  @Expose({ name: 'total' })
  total: string

  @Expose({ name: 'order_class' })
  orderClass: ORDER_CLASS

  @Expose({ name: 'side' })
  side: ORDER_TYPE

  @Expose({ name: 'total_currency' })
  totalCurrency: string

  @Expose({ name: 'filled_amount' })
  filledAmount: string

  @Expose({ name: 'fee' })
  fee: string

  @Expose({ name: 'fee_currency' })
  feeCurrency: string

  @Expose({ name: 'create_time' })
  createTime: string
}

export class TradeHistoryItemDto {
  @Expose({ name: 'trade_id' })
  tradeId: string

  @Expose({ name: 'strategy_id' })
  strategyId: string

  @Expose({ name: 'create_time' })
  createTime: string

  @Expose({ name: 'profit' })
  profit: string

  @Expose({ name: 'profit_currency' })
  profitCurrency: string

  @Expose({ name: 'buy' })
  @Type(() => TradeHistoryOrderInfoDto)
  buy: TradeHistoryOrderInfoDto

  @Expose({ name: 'sell' })
  @Type(() => TradeHistoryOrderInfoDto)
  sell: TradeHistoryOrderInfoDto
}

export class GetTradeHistoryResponse {
  @Expose()
  @Type(() => TradeHistoryItemDto)
  data: TradeHistoryItemDto[]

  @Expose()
  @Type(() => LinkPaginationResponse)
  links: LinkPaginationResponse

  @Expose()
  @Type(() => PaginationData)
  pagination: PaginationData
}
