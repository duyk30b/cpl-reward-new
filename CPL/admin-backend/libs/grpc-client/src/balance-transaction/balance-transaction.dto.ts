import { ApiProperty } from '@nestjs/swagger'
import { TRANSACTION_TYPE } from 'apps/api/src/api-balance/balance.enum'
import { Expose, Transform } from 'class-transformer'
import { BalanceAccountDto } from '../balance-account/balance-account.dto'

export class CreateTransactionRequest {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'balance_type' })
  balanceType: string

  @Expose()
  items: TransactionItem[]
}

export class CreateTransactionResponse {
  @Expose({ name: 'balance_accounts', toPlainOnly: true })
  balanceAccounts: BalanceAccountDto[]

  @Expose({ name: 'balance_transactions', toPlainOnly: true })
  balanceTransactions: BalanceTransaction[]
}

export class TransactionItem {
  @Expose({ name: 'transaction_type', toPlainOnly: true })
  transactionType: TRANSACTION_TYPE

  @Expose({ name: 'currency' })
  currency: string

  @Expose({ name: 'amount' })
  amount: string

  @Expose({ name: 'transaction_reference_id', toPlainOnly: true })
  transactionReferenceId: string
}

export class BalanceTransaction {
  @ApiProperty({ name: 'user_id' })
  @Expose()
  id: string

  @ApiProperty({ name: 'transaction_reference_id' })
  @Expose({ name: 'transaction_reference_id', toPlainOnly: true })
  transactionReferenceId: string

  @ApiProperty({ name: 'balance_account_id' })
  @Expose({ name: 'balance_account_id', toPlainOnly: true })
  balanceAccountId: string

  @ApiProperty()
  @Expose()
  amount: string

  @ApiProperty({ enum: TRANSACTION_TYPE })
  @Expose()
  @Transform(({ value }) => TRANSACTION_TYPE[value], { toPlainOnly: true })
  type: TRANSACTION_TYPE

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string
}
