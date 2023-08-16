import { Expose, Transform } from 'class-transformer'
import { SWAP_STATUS } from '@/views/apps/swap-setting/definition/swap-setting.enum'
import { BALANCE_TYPE } from '@/enums/balance.enum'

export class PaginationDto {
  @Expose()
  page: number

  @Expose()
  size: number

  @Expose()
  total: number
}

export class BalanceSwap {
  @Expose()
  id: string

  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose({ name: 'balance_type', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceType: string

  @Expose({ name: 'exchange_from', toPlainOnly: true })
  exchangeFrom: string

  @Expose({ name: 'exchange_to', toPlainOnly: true })
  exchangeTo: string

  @Expose({ name: 'coin_from', toPlainOnly: true })
  coinFrom: string

  @Expose({ name: 'coin_to', toPlainOnly: true })
  coinTo: string

  @Expose({ name: 'rate', toPlainOnly: true })
  rate: string

  @Expose({ name: 'amount', toPlainOnly: true })
  amount: string

  @Expose({ name: 'fee', toPlainOnly: true })
  fee: string

  @Expose({ name: 'received', toPlainOnly: true })
  received: string

  @Expose({ name: 'status', toPlainOnly: true })
  @Transform(({ value }) => SWAP_STATUS[value], {
    toPlainOnly: true,
  })
  status: string

  @Expose({ name: 'data_raw', toPlainOnly: true })
  dataRaw: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class ListBalanceSwapRequest {
  @Expose({ name: 'currencies', toPlainOnly: true })
  currencies?: string

  @Expose({ name: 'user_ids', toPlainOnly: true })
  userIds?: string

  @Expose({ name: 'balance_types_from', toPlainOnly: true })
  balanceTypesFrom?: string

  @Expose({ name: 'balance_types_to', toPlainOnly: true })
  balanceTypesTo?: string

  @Expose({ name: 'start_date', toPlainOnly: true })
  startDate?: string

  @Expose({ name: 'end_date', toPlainOnly: true })
  endDate?: string

  @Expose()
  page?: number

  @Expose()
  size?: number

  @Expose()
  sort?: string

  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => (value ? value.toUpperCase() : null))
  sortType?: 'ASC' | 'DESC'
}

export class ListBalanceSwapResponse {
  @Expose({ name: 'data' })
  data: Array<BalanceSwap>

  @Expose({ name: 'pagination' })
  pagination: PaginationDto
}
