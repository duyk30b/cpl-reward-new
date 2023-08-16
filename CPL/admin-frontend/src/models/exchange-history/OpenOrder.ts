import { BigNumber } from 'bignumber.js'
import { Exclude, Expose, Transform } from 'class-transformer'
import { PaginationDto } from '../common/response-pagination.dto'

export enum OrderbookStatus {
  BOTH = 'both',
  SELL = 'sell',
  BUY = 'buy',
}

@Exclude()
export class OrderBookParams {
  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  precision: string
}

@Exclude()
export class PairSelectItem {
  @Expose()
  coin: string

  @Expose()
  currency: string
}

@Exclude()
export class OrderItem {
  @Expose()
  price: string

  @Expose()
  volume: string

  @Expose()
  get total() {
    const price = new BigNumber(this.price?.toString() || 0)
    const volume = new BigNumber(this.volume?.toString() || 0)
    return price.multipliedBy(volume) || undefined
  }
}

@Exclude()
export class OrderBookItem {
  @Expose()
  buy: OrderItem[]

  @Expose()
  sell: OrderItem[]
}

// FIXME: Value of enum defined from backend, careful when changing
export enum ORDER_DROPDOWN_SEARCH_KEY {
  ORDER_ID = 'order_id',
  EMAIL = 'email',
  ALL = 'all',
}

export enum USER_DROPDOWN_SEARCH_KEY {
  USER_ID = 'user_id',
  EMAIL = 'email',
  ALL = 'all',
}

@Exclude()
export class OpenOrderParams {
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

  @Expose({ name: 'side' })
  order_type?: string

  @Expose({ name: 'type' })
  order_class?: string

  @Expose({ name: 'page' })
  page?: string

  @Expose({ name: 'per_page' })
  per_page?: string

  @Expose({ name: 'keywordType' })
  search_by_field?: string

  @Expose({ name: 'keyword' })
  keyword?: string

  @Expose({ name: 'user_type' })
  user_type?: string

  @Expose({ name: 'sort' })
  sort_by?: string

  @Expose()
  @Transform(({ value }) => (value && value == 'ASC' ? 1 : -1))
  sort_type?: number

  @Expose({ name: 'price' })
  orderbook_price?: string

  @Expose({ name: 'selected_side' })
  orderbook_type?: number
}

@Exclude()
export class OpenOrderItem {
  @Expose()
  create_time: string | number

  @Expose()
  user_id: string

  @Expose()
  order_id: string | number

  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  order_class: string

  @Expose()
  order_type: string

  @Expose()
  price: string

  @Expose()
  volume: string

  @Expose()
  status: number

  @Expose()
  error_count = 0
}

export class ExportOpenOrderResponse {
  @Expose()
  status: boolean
}

export class GetListOpenOrderResponse {
  @Expose()
  data: OpenOrderItem[]

  @Expose()
  pagination: PaginationDto
}
