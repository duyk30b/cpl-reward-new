import { ApiProperty } from '@nestjs/swagger'
import { BALANCE_TYPE } from 'apps/api/src/api-balance/balance.enum'
import { Expose, Transform } from 'class-transformer'
import { BalanceAccountDto } from '../balance-account/balance-account.dto'
import { BalanceTransaction } from '../balance-transaction/balance-transaction.dto'
import { PaginationResultDto } from '../grpc-client.dto'

export class BalanceTransferDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'transaction_reference_id' })
  @Expose({ name: 'transfer_reference_id', toPlainOnly: true })
  transferReferenceId: string

  @ApiProperty({ name: 'user_id_from' })
  @Expose({ name: 'user_id_from', toPlainOnly: true })
  userIdFrom: string

  @ApiProperty({ name: 'user_id_to' })
  @Expose({ name: 'user_id_to', toPlainOnly: true })
  userIdTo: string

  @ApiProperty()
  @Expose()
  currency: string

  @ApiProperty({ name: 'balance_type_from', enum: BALANCE_TYPE })
  @Expose({ name: 'balance_type_from', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceTypeFrom: string

  @ApiProperty({ name: 'balance_type_to', enum: BALANCE_TYPE })
  @Expose({ name: 'balance_type_to', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceTypeTo: string

  @ApiProperty()
  @Expose()
  amount: string

  @ApiProperty()
  @Expose()
  status: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class ListBalanceTransferResult {
  @ApiProperty()
  @Expose()
  data: BalanceTransferDto[]

  @ApiProperty()
  @Expose()
  pagination: PaginationResultDto
}
export class BalanceTransferReponseDto {
  @ApiProperty({ name: 'balance_accounts', type: [BalanceAccountDto] })
  @Expose({ name: 'balance_accounts', toPlainOnly: true })
  balanceAccount: BalanceAccountDto[]

  @ApiProperty({ name: 'balance_transactions', type: [BalanceTransaction] })
  @Expose({ name: 'balance_transactions', toPlainOnly: true })
  balanceTransactions: BalanceTransaction[]

  @ApiProperty({ name: 'balance_transfer', type: BalanceTransferDto })
  @Expose({ name: 'balance_transfer', toPlainOnly: true })
  balanceTransfer: BalanceTransferDto
}

export class BalanceTransferResultDto {
  @ApiProperty()
  @Expose()
  data: BalanceTransferReponseDto
}
