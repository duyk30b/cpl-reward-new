import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import {
  BALANCE_TYPE,
  TRANSACTION_TYPE,
} from 'apps/api/src/api-balance/balance.enum'
import { Optional } from '@nestjs/common'

enum BALANCE_TRANSFER_STATUS {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2,
}

export class PaginationDto {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  size: number

  @ApiProperty()
  @Expose()
  total: number
}

export class BalanceAccount {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @ApiProperty({ name: 'currency' })
  @Expose({ name: 'currency', toPlainOnly: true })
  currency: string

  @ApiProperty({ name: 'type' })
  @Expose({ name: 'type', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  type: string

  @ApiProperty({ name: 'actual_balance' })
  @Expose({ name: 'actual_balance', toPlainOnly: true })
  actualBalance: string

  @ApiProperty({ name: 'available_balance' })
  @Expose({ name: 'available_balance', toPlainOnly: true })
  availableBalance: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class BalanceTransaction {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'transaction_reference_id' })
  @Expose({ name: 'transaction_reference_id', toPlainOnly: true })
  transactionReferenceId: string

  @ApiProperty({ name: 'balance_account_id' })
  @Expose({ name: 'balance_account_id', toPlainOnly: true })
  balanceAccountId: string

  @ApiProperty({ name: 'on_hold_transaction_id' })
  @Expose({ name: 'on_hold_transaction_id', toPlainOnly: true })
  onHoldTransactionId: string

  @ApiProperty({ name: 'amount' })
  @Expose({ name: 'amount', toPlainOnly: true })
  amount: string

  @ApiProperty({ name: 'type' })
  @Expose({ name: 'type', toPlainOnly: true })
  @Transform(({ value }) => TRANSACTION_TYPE[value], { toPlainOnly: true })
  type: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string
}

export class BalanceTransfer {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'transfer_reference_id' })
  @Expose({ name: 'transfer_reference_id', toPlainOnly: true })
  transferReferenceId: string

  @ApiProperty({ name: 'user_id_from' })
  @Expose({ name: 'user_id_from', toPlainOnly: true })
  userIdFrom: string

  @ApiProperty({ name: 'user_id_to' })
  @Expose({ name: 'user_id_to', toPlainOnly: true })
  userIdTo: string

  @ApiProperty({ name: 'currency' })
  @Expose({ name: 'currency', toPlainOnly: true })
  currency: string

  @ApiProperty({ name: 'balance_type_from' })
  @Expose({ name: 'balance_type_from', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceTypeFrom: string

  @ApiProperty({ name: 'balance_type_to' })
  @Expose({ name: 'balance_type_to', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceTypeTo: string

  @ApiProperty({ name: 'amount' })
  @Expose({ name: 'amount', toPlainOnly: true })
  amount: string

  @ApiProperty({ name: 'status' })
  @Expose({ name: 'status', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TRANSFER_STATUS[value], {
    toPlainOnly: true,
  })
  status: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class ListBalanceTransferRequest {
  @ApiProperty({
    required: false,
  })
  @Optional()
  @Expose({ name: 'currencies' })
  currencies: string

  @ApiProperty({ required: false, name: 'user_ids' })
  @Optional()
  @Expose({ name: 'user_ids' })
  userIds: string

  @ApiProperty({ required: false, name: 'balance_types_from' })
  @Optional()
  @Expose({ name: 'balance_types_from' })
  balanceTypesFrom: string

  @ApiProperty({ required: false, name: 'balance_types_to' })
  @Optional()
  @Expose({ name: 'balance_types_to' })
  balanceTypesTo: string

  @ApiProperty({ required: false, name: 'start_date' })
  @Optional()
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ required: false, name: 'end_date' })
  @Optional()
  @Expose({ name: 'end_date' })
  endDate: string

  @ApiProperty({
    required: false,
  })
  @Optional()
  @Expose()
  page: number

  @ApiProperty({
    required: false,
  })
  @Optional()
  @Expose()
  size: number

  @ApiProperty({
    required: false,
  })
  @Expose()
  sort: string

  @ApiProperty({
    name: 'sort_type',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @Optional()
  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => (value ? value.toUpperCase() : null))
  sortType?: 'ASC' | 'DESC'
}

export class ListBalanceTransferResponse {
  @ApiProperty({ required: false, name: 'data' })
  @Expose({ name: 'data' })
  data: Array<BalanceTransfer>

  @ApiProperty({ required: false, name: 'pagination' })
  @Optional()
  @Expose({ name: 'pagination' })
  pagination?: PaginationDto
}
