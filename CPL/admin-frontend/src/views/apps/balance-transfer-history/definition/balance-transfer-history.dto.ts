import { Expose, Transform } from 'class-transformer'
import { BALANCE_TYPE, TRANSACTION_TYPE } from '@/enums/balance.enum'
import { BALANCE_TRANSFER_STATUS } from '@/views/apps/balance-transfer-history/definition/balance-transfer-history.enum'

export class PaginationDto {
  @Expose()
  page: number

  @Expose()
  size: number

  @Expose()
  total: number
}

export class BalanceAccount {
  @Expose()
  id: string

  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose({ name: 'currency', toPlainOnly: true })
  currency: string

  @Expose({ name: 'type', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  type: string

  @Expose({ name: 'actual_balance', toPlainOnly: true })
  actualBalance: string

  @Expose({ name: 'available_balance', toPlainOnly: true })
  availableBalance: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class BalanceTransaction {
  @Expose()
  id: string

  @Expose({ name: 'transaction_reference_id', toPlainOnly: true })
  transactionReferenceId: string

  @Expose({ name: 'balance_account_id', toPlainOnly: true })
  balanceAccountId: string

  @Expose({ name: 'on_hold_transaction_id', toPlainOnly: true })
  onHoldTransactionId: string

  @Expose({ name: 'amount', toPlainOnly: true })
  amount: string

  @Expose({ name: 'type', toPlainOnly: true })
  @Transform(({ value }) => TRANSACTION_TYPE[value], { toPlainOnly: true })
  type: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string
}

export class BalanceTransfer {
  @Expose()
  id: string

  @Expose({ name: 'transfer_reference_id', toPlainOnly: true })
  transferReferenceId: string

  @Expose({ name: 'user_id_from', toPlainOnly: true })
  userIdFrom: string

  @Expose({ name: 'user_id_to', toPlainOnly: true })
  userIdTo: string

  @Expose({ name: 'currency', toPlainOnly: true })
  currency: string

  @Expose({ name: 'balance_type_from', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceTypeFrom: string

  @Expose({ name: 'balance_type_to', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceTypeTo: string

  @Expose({ name: 'amount', toPlainOnly: true })
  amount: string

  @Expose({ name: 'status', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TRANSFER_STATUS[value], {
    toPlainOnly: true,
  })
  status: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class ListBalanceTransferRequest {
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

export class ListBalanceTransferResponse {
  @Expose({ name: 'data' })
  data: Array<BalanceTransfer>

  @Expose({ name: 'pagination' })
  pagination: PaginationDto
}
