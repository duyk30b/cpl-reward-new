import { SORT_TYPE } from '@/core/variables/common.enum'
import { Exclude, Expose } from 'class-transformer'
import { PairPagination } from './TradingPair'

@Exclude()
export class CoinNetwork {
  @Expose()
  network = ''

  @Expose()
  env = ''

  @Expose()
  symbol = ''

  @Expose()
  confirmations = 2

  @Expose()
  decimal = 1

  @Expose()
  status = 0

  @Expose()
  transaction_explorer = ''

  @Expose()
  transaction_tx_path = ''

  @Expose()
  type = ''
}

export class CoinItem {
  coin: string
  name: string
  icon: string
  status: number
  networks: CoinNetwork[]
}

export class CoinList {
  data: CoinItem[]
  pagination?: PairPagination
}

export class GetListCoinNameResponse {
  data: string[]
  pagination?: PairPagination
}

export class GetListCoinName {
  @Expose()
  sort_type?: SORT_TYPE

  @Expose()
  per_page?: number = 25

  @Expose()
  page?: number = 1

  @Expose()
  coin?: string
}
