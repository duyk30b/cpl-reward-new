import { PAIR_STATUS } from '@/core/variables/common.enum'
import { Exclude, Expose } from 'class-transformer'

export class PairParam {
  coin?: string
  currency?: string
}

export const MAXIMUM_NUMBER_OF_DAYS_TO_SAVE_VOLUME = 7

export enum FEE_TYPE {
  PERCENTAGE = 1,
  NUMBER = 2,
}

export enum CHARGE_BY {
  DEFAULT = 0,
  REWARD = 1,
  CASTLE = 2,
}

@Exclude()
export class PairItem {
  @Expose()
  coin = ''

  @Expose()
  currency = ''

  @Expose()
  status = PAIR_STATUS.INACTIVE

  @Expose()
  obm_active = PAIR_STATUS.INACTIVE

  @Expose()
  precisions_obm: string[] = []

  @Expose()
  precisions: string[] = []

  @Expose()
  default_precision = ''

  @Expose()
  minimum_amount = ''

  @Expose()
  minimum_total = ''

  @Expose()
  decimal_of_price = ''

  @Expose()
  decimal_of_amount = ''

  @Expose()
  init_price = ''

  @Expose()
  n_day_amount_limit = ''

  @Expose()
  n_day_total_limit = ''

  @Expose()
  limit_span = ''

  @Expose()
  buy_fee = '0'

  @Expose()
  buy_fee_currency = ''

  @Expose()
  buy_fee_type = FEE_TYPE.PERCENTAGE

  @Expose()
  sell_fee = '0'

  @Expose()
  sell_fee_currency = ''

  @Expose()
  sell_fee_type = FEE_TYPE.PERCENTAGE

  @Expose()
  init_time = ''

  @Expose()
  charge_by = CHARGE_BY.DEFAULT
}

export class PairPagination {
  page: number
  size: number
  total: number
}

export class PairList {
  data: PairItem[]
  pagination?: PairPagination
}

export class CoinCurrencyItem {
  @Expose()
  coin: string

  @Expose()
  currency: string
}
