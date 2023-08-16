import { ApiProperty } from '@nestjs/swagger'
import {
  ABNORMAL_BALANCE_ACCOUNT_STATUS,
  BALANCE_TYPE,
  CORRECTED_TYPE,
  TRANSACTION_TYPE,
} from 'apps/api/src/api-balance/balance.enum'
import { Expose, Transform, Type } from 'class-transformer'
import { PaginationResultDto } from '../grpc-client.dto'

export class AbnormalBalanceUserEntityDto {
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose()
  email: string

  @Expose()
  createdAt: string
}

export class GetAbnormalBalanceUsersResultDto {
  @ApiProperty()
  @Expose()
  data: AbnormalBalanceUserEntityDto[]

  @ApiProperty()
  @Expose()
  pagination: PaginationResultDto
}

export class AbnormalBalanceAccountEntityDto {
  @Expose()
  id: string

  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose()
  currency: string

  @Expose()
  type: BALANCE_TYPE

  @Expose({ name: 'actual_balance', toPlainOnly: true })
  actualBalance: string

  @Expose({ name: 'is_abnormal_actual_balance', toPlainOnly: true })
  isAbnormalActualBalance: string

  @Expose({ name: 'available_balance', toPlainOnly: true })
  availableBalance: string

  @Expose({ name: 'is_abnormal_available_balance', toPlainOnly: true })
  isAbnormalAvailableBalance: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class GetAbnormalBalanceAccountsResultDto {
  @ApiProperty()
  @Expose()
  data: AbnormalBalanceAccountEntityDto[]

  @ApiProperty()
  @Expose()
  pagination: PaginationResultDto
}

export class OriginAbnormalBalanceAccountEntity {
  @Expose()
  id: string

  @Expose({ name: 'balance_account_id', toPlainOnly: true })
  balanceAccountId: string

  @Expose({ name: 'before_balance_history_id', toPlainOnly: true })
  beforeBalanceHistoryId: string

  @Expose({ name: 'balance_history_id', toPlainOnly: true })
  balanceHistoryId: string

  @Expose({ name: 'balance_transaction_id', toPlainOnly: true })
  balanceTransactionId: string

  @Expose({ name: 'on_hold_transaction_id', toPlainOnly: true })
  onHoldTransactionId: string

  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose({ name: 'corrected_by', toPlainOnly: true })
  correctedBy: string

  @Expose({ name: 'balance_type', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceType: string

  @Expose()
  currency: string

  @Expose({ name: 'change_actual_balance', toPlainOnly: true })
  changeActualBalance: string

  @Expose({ name: 'change_available_balance', toPlainOnly: true })
  changeAvailableBalance: string

  @Expose({ name: 'fixed_actual_balance', toPlainOnly: true })
  fixedActualBalance: string

  @Expose({ name: 'fixed_available_balance', toPlainOnly: true })
  @ApiProperty()
  fixedAvailableBalance: string

  @Expose()
  @ApiProperty()
  reason: string

  @Expose()
  @ApiProperty()
  data: string

  @ApiProperty({ enum: ABNORMAL_BALANCE_ACCOUNT_STATUS })
  @Transform(({ value }) => ABNORMAL_BALANCE_ACCOUNT_STATUS[value], {
    toPlainOnly: true,
  })
  @Expose()
  status: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  @ApiProperty()
  createdAt: string

  @Expose({ name: 'updated_at', toPlainOnly: true })
  @ApiProperty()
  updatedAt: string
}

export class ResponseCorrectEntity {
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose()
  currency: string

  @Expose({ name: 'balance_type', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceType: string

  @Expose({ name: 'corrected_type', toPlainOnly: true })
  @Transform(({ value }) => CORRECTED_TYPE[value], { toPlainOnly: true })
  correctedType: string

  @Expose({ name: 'corrected_by', toPlainOnly: true })
  correctedBy: string

  @Expose({ name: 'diff_actual_balance', toPlainOnly: true })
  diffActualBalance: string

  @Expose({ name: 'diff_available_balance', toPlainOnly: true })
  diffAvailableBalance: string

  @Expose({ name: 'to_balance_history_id', toPlainOnly: true })
  toBalanceHistoryId: string

  @Expose({ name: 'from_balance_history_id', toPlainOnly: true })
  fromBalanceHistoryId: string
}

export class ResponseGetDiffBalanceEntity {
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @Expose()
  currency: string

  @Expose({ name: 'balance_type', toPlainOnly: true })
  balanceType: string

  @Expose({ name: 'current_actual_balance', toPlainOnly: true })
  currentActualBalance: string

  @Expose({ name: 'current_available_balance', toPlainOnly: true })
  currentAvailableBalance: string

  @Expose({ name: 'total_amount_transaction', toPlainOnly: true })
  totalAmountTransaction: string

  @Expose({ name: 'total_on_hold_transaction', toPlainOnly: true })
  totalOnHoldTransaction: string

  @Expose({ name: 'diff_actual_balance', toPlainOnly: true })
  diffActualBalance: string

  @Expose({ name: 'diff_available_balance', toPlainOnly: true })
  diffAvailableBalance: string
}

export class AbnormalBalanceHistoryEntityDto {
  @Expose()
  id: string

  @Expose({ name: 'abnormal_balance_account', toPlainOnly: true })
  @Type(() => OriginAbnormalBalanceAccountEntity)
  abnormalBalanceAccount: OriginAbnormalBalanceAccountEntity

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

  @Expose({ name: 'status', toPlainOnly: true })
  status: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string
}

export class GetAbnormalBalanceHistoriesResultDto {
  @ApiProperty()
  @Expose()
  data: AbnormalBalanceHistoryEntityDto[]

  @ApiProperty()
  @Expose()
  pagination: PaginationResultDto
}
