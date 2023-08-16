import { Expose, Transform, Type } from 'class-transformer'

export class PaginationDto {
  @Expose()
  page: number

  @Expose()
  size: number

  @Expose()
  total: number
}

export class ConvertSmallBalance {
  @Expose()
  id: string

  @Expose({ name: 'module', toPlainOnly: true })
  module: string

  @Expose({ name: 'code', toPlainOnly: true })
  code: string

  @Expose({ name: 'value', toPlainOnly: true })
  value: string

  @Expose({ name: 'status', toPlainOnly: true })
  status: number | boolean

  @Expose({ name: 'created_at', toPlainOnly: true })
  created_at: string

  @Expose({ name: 'updated_at', toPlainOnly: true })
  updated_at: string
}

export class ConvertSmallBalanceLog extends ConvertSmallBalance {
  @Expose({ name: 'setting_convert_id', toPlainOnly: true })
  ConvertSmallBalanceId: string

  @Expose({ name: 'config_by', toPlainOnly: true })
  configBy: number
}

export class ConvertSmallBalanceListResultDto {
  @Type(() => ConvertSmallBalance)
  @Expose({ name: 'data' })
  data: ConvertSmallBalance[] = []

  @Expose()
  pagination: PaginationDto
}

export class ConvertSmallBalanceListLogResultDto {
  @Expose({ name: 'data' })
  data: ConvertSmallBalanceLog[]

  pagination: PaginationDto
}

export class GetConvertSmallBalanceRequest {
  @Expose({ name: 'id' })
  id: string
}

export class ListConvertSmallBalanceRequest {
  @Expose({ name: 'search_field' })
  search_field?: string

  @Expose({ name: 'search_text' })
  search_text?: string

  @Expose({ name: 'sort' })
  sort?: string

  @Expose({ name: 'sort_type' })
  sort_type?: string

  @Expose({ name: 'page' })
  page: number

  @Expose({ name: 'size' })
  size: number

  @Expose({ name: 'limit' })
  limit: number
}

export class ListConvertSmallBalanceLogRequest extends ListConvertSmallBalanceRequest {
  //
}

export class CreateConvertSmallBalanceRequest {
  @Expose({ name: 'module', toPlainOnly: true })
  module: string

  @Expose({ name: 'code', toPlainOnly: true })
  code: string

  @Expose({ name: 'value', toPlainOnly: true })
  value: string

  @Expose({ name: 'status', toPlainOnly: true })
  status: number | boolean
}

export class UpdateConvertSmallBalanceRequest {
  @Expose({ name: 'id', toPlainOnly: true })
  id: string

  @Expose({ name: 'module', toPlainOnly: true })
  module: string

  @Expose({ name: 'code', toPlainOnly: true })
  code: string

  @Expose({ name: 'value', toPlainOnly: true })
  value: string

  @Expose({ name: 'status', toPlainOnly: true })
  status: number | boolean
}

export class DeleteConvertSmallBalanceRequest {
  @Expose({ name: 'id' })
  id: string
}

export class Coin {
  coin: string
  name: string
}

export class BalanceConvertSmallHistory {
  @Expose()
  id: string

  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose({ name: 'balance_type', toPlainOnly: true })
  balanceType: string

  @Expose({ name: 'total_received', toPlainOnly: true })
  totalReceived: string

  @Expose({ name: 'fee_coin', toPlainOnly: true })
  feeCoin: string

  @Expose({ name: 'total_fee', toPlainOnly: true })
  totalFee: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string
}

export class BalanceConvertSmallHistoryDetail {
  @Expose()
  id: string

  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose({ name: 'convert_small_id', toPlainOnly: true })
  convertSmallId: string

  @Expose({ name: 'coin_from', toPlainOnly: true })
  coinFrom: string

  @Expose({ name: 'coin_to', toPlainOnly: true })
  coinTo: string

  @Expose({ name: 'balance_type', toPlainOnly: true })
  balanceType: string

  @Expose({ name: 'amount_from', toPlainOnly: true })
  amountFrom: string

  @Expose({ name: 'amount_to', toPlainOnly: true })
  amountTo: string

  @Expose({ name: 'fee_coin', toPlainOnly: true })
  feeCoin: string

  @Expose({ name: 'fee_amount', toPlainOnly: true })
  feeAmount: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string
}

export class BalanceConvertSmallHistoryRequest {
  @Expose({ name: 'user_ids', toPlainOnly: true })
  userIds?: string

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

export class ConvertSmallBalanceHistoryDto {
  @Type(() => BalanceConvertSmallHistory)
  @Expose({ name: 'data' })
  data: BalanceConvertSmallHistory[] = []

  @Expose()
  pagination: PaginationDto
}

export class ListConvertSmallBalanceDetail {
  [key: string]: Array<BalanceConvertSmallHistoryDetail>
}
