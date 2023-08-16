import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class OBMCounterOrderParams {
  @Expose({ name: 'page' })
  page? = 1

  @Expose({ name: 'per_page' })
  limit? = 10

  @Expose()
  bce_counter_order_id?: string

  @Expose()
  module?: string

  @Expose()
  status?: string

  @Expose()
  coin?: string

  @Expose()
  currency?: string

  @Expose()
  exchange?: string

  @Expose({ name: 'bceOrderId' })
  receive_id?: string
}

export class InputSetting {
  adjustment_rate: string
  commission_fee: string
}

export class RecoveryOrderItem {
  actual_price: string
  actual_volume: string
  coin: string
  counter_order: CounterOrderItem[]
  complete_time: string
  counter_order_id: string
  currency: string
  exchange: string
  expect_price: string
  expect_volume: string
  id: string
  input_setting: string
  order_class: string
  order_type: string
  profit: string
  profit_status: number
  receive_id: string
  receive_time: string
  send_time: string
  status: string
}

export class CounterOrderItem {
  actual_price: string
  actual_volume: string
  coin: string
  complete_time: string
  currency: string
  current_price: number
  exchange: string
  expect_price: string
  expect_volume: string
  id: string
  input_setting: InputSetting
  module: string
  order_class: string
  order_type: string
  profit_actual: number
  profit_all: number
  profit_percent: number
  profit_virtual: number
  receive_id: string
  receive_time: string
  recovery_order: RecoveryOrderItem
  recovery_order_id: string
  send_id: string
  send_time: string
  status: string
}

export class PairPagination {
  page: number
  size: number
  total: number
}

export class CounterOrderResponse {
  data: CounterOrderItem[]
  pagination: PairPagination
}
