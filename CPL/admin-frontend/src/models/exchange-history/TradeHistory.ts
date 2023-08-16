import { Exclude, Expose, Transform } from 'class-transformer'
import { PaginationDto } from '../common/response-pagination.dto'

export enum ORDER_TYPE {
  Buy = 1,
  Sell = 2,
}

export enum ORDER_CLASS {
  Market = 1,
  Limit = 2,
  StopMarket = 3,
  StopLimit = 4,
}

// FIXME: Value of enum defined from backend, careful when changing
export enum DROPDOWN_SEARCH_KEY {
  BUY_ORDER_ID = 'buy_order_id',
  BUY_EMAIL = 'buy_email',
  SELL_ORDER_ID = 'sell_order_id',
  SELL_EMAIL = 'sell_email',
  TRADE_ID = 'id',
  ALL = 'all',
}

export const TRANSACTION_FEE_WALLET_TYPE = {
  1: 'spotWallet',
  2: 'rewardWallet',
}

@Exclude()
export class TradeHistoryParams {
  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose({ name: 'from' })
  @Transform(({ value }) => (value ? new Date(value).getTime() : undefined))
  from?: string

  @Expose({ name: 'to' })
  @Transform(({ value }) =>
    value ? new Date(value).getTime() + 86399999 : undefined,
  )
  to?: string

  @Expose({ name: 'page' })
  page?: string

  @Expose({ name: 'per_page' })
  per_page?: string

  @Expose({ name: 'keywordType' })
  search_by_field?: string

  @Expose({ name: 'keyword' })
  keyword?: string

  @Expose({ name: 'sort' })
  sort_by?: string

  @Expose()
  @Transform(({ value }) => (value && value == 'ASC' ? 1 : -1))
  sort_type?: number
}

@Exclude()
export class TradeHistoryItem {
  @Expose()
  create_time: string | number

  @Expose()
  trade_id: string

  @Expose()
  buy_order_id: string | number

  @Expose()
  buyer_id: string

  @Expose()
  sell_order_id: string | number

  @Expose()
  seller_id: string

  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  buy_currency: string

  @Expose()
  sell_currency: string

  @Expose()
  price: string

  @Expose()
  volume: string

  @Expose()
  filled: string

  @Expose()
  buy_fee: string

  @Expose()
  sell_fee: string

  @Expose()
  buy_email: string

  @Expose()
  sell_email: string

  @Expose()
  buy_fee_wallet_type: number

  @Expose()
  sell_fee_wallet_type: number
}

export class ExportTradeHistoryResponse {
  @Expose()
  status: boolean
}

export class GetListTradeHistoryResponse {
  @Expose()
  data: TradeHistoryItem[]

  @Expose()
  pagination: PaginationDto
}
