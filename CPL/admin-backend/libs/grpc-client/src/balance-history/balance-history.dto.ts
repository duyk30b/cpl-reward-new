import { ApiProperty } from '@nestjs/swagger'
import {
  BALANCE_TYPE,
  TRANSACTION_TYPE,
} from 'apps/api/src/api-balance/balance.enum'
import { Expose } from 'class-transformer'
import { PaginationResultDto } from '../grpc-client.dto'

export class BalanceHistoryEntityResultDto {
  @Expose()
  id: string

  @Expose({ name: 'balance_type', toPlainOnly: true })
  balanceType: BALANCE_TYPE

  @Expose()
  currency: string

  @Expose({ name: 'actual_balance_change', toPlainOnly: true })
  actualBalanceChange: string

  @Expose({ name: 'actual_balance', toPlainOnly: true })
  actualBalance: string

  @Expose({ name: 'available_balance_change', toPlainOnly: true })
  availableBalanceChange: string

  @Expose({ name: 'available_balance', toPlainOnly: true })
  availableBalance: string

  @Expose({ name: 'transaction_type', toPlainOnly: true })
  transactionType: TRANSACTION_TYPE

  @Expose({ name: 'reference_id', toPlainOnly: true })
  referenceId: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @Expose()
  version: string
}

export class ListBalanceHistoryResultDto {
  @ApiProperty()
  @Expose()
  data: BalanceHistoryEntityResultDto[]

  @ApiProperty()
  @Expose()
  pagination: PaginationResultDto
}
