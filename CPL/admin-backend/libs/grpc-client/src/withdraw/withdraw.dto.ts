import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { WithdrawGroupEnum } from './withdraw.enum'

export class DataModule {
  privateKey: string
  address: string
}

@Exclude()
export class withdrawalGroupRequest {
  @ApiProperty({
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  id: number
}

@Exclude()
export class WalletKeyValue {
  @Expose()
  data: DataModule

  @Expose()
  message: string

  @Expose()
  time_stamp: number

  @Expose()
  @ApiPropertyOptional()
  total_count?: number
}

@Exclude()
export class ListWithdrawGroupRequest {
  @Expose()
  @ApiPropertyOptional()
  currency: string

  @Expose()
  @ApiPropertyOptional()
  keyword: string

  @Expose()
  @ApiPropertyOptional()
  page: number

  @Expose()
  @ApiPropertyOptional()
  size: number

  @Expose()
  @ApiPropertyOptional()
  status: string
}

export class WithdrawGroupValue {
  admin_id: number
  chain_code: string
  currency: string
  id: number
  status: string
  name: string
  total_balance: string
  total_fee: string
  total_transaction: number
  wallet_address?: string
  create_date: string
  update_date: string
  current_balance: string
  suggested_fee: string
  native_current_balance: string
}

export class ListWithdrawGroupResponse {
  message: string
  time_stamp: number
  total_count: number
  data: WithdrawGroupValue
}

@Exclude()
export class CreateWithdrawGroupRequest {
  @Expose()
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name: string

  @Expose()
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  currency: string
}

export class WithdrawGroupResponse {
  data: WithdrawGroupValue
  message: string
  meta_data?: { transaction_hash: string }
  time_stamp: number
}

@Exclude()
export class UpdateGroupStatusRequest {
  @Expose()
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(WithdrawGroupEnum)
  status: string

  @Expose({ name: 'group_id' })
  @ApiProperty({
    required: true,
    name: 'group_id',
  })
  @IsNotEmpty()
  groupId: number
}

@Exclude()
export class AutoWithdraw {
  @Expose()
  @ApiPropertyOptional()
  toAddress: string

  @Expose()
  @ApiPropertyOptional()
  amount: string

  @Expose({ name: 'withdraw_request_id' })
  @ApiPropertyOptional({ name: 'withdraw_request_id' })
  withdrawRequestId: string

  @Expose()
  @ApiPropertyOptional()
  email: string
}

@Exclude()
export class saveAutoWithdrawRequest {
  @Expose()
  @ApiProperty({
    required: true,
    default: [
      {
        toAddress: 'string',
        amount: 'string',
        withdraw_request_id: 'string',
        email: 'string',
      },
    ],
  })
  @Type(() => AutoWithdraw)
  withdraws: AutoWithdraw[]

  @Expose()
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  groupId: number
}

export class saveAutoWithdrawResponse {
  data: boolean
  message: string
  time_stamp: number
  total_count: number
}

@Exclude()
export class getListAutoWithdrawRequest {
  @Expose()
  @ApiPropertyOptional()
  page?: number

  @Expose()
  @ApiPropertyOptional()
  size?: number

  @Expose({ name: 'group_id' })
  @ApiPropertyOptional({
    name: 'group_id',
  })
  groupId?: number

  @Expose()
  @ApiPropertyOptional()
  currency?: string

  @Expose()
  @ApiPropertyOptional()
  status?: string

  @Expose()
  @ApiPropertyOptional()
  email: string
}

export class AutoWithdrawValue {
  id: number
  withdraw_group_id: number
  withdraw_request_id: string
  to_address: string
  currency: string
  amount: string
  fee: string
  tx_hash: string
  status: string
  error: string
  create_date: string
  update_date: string
  email: string
}

export class getListAutoWithdrawResponse {
  data: AutoWithdrawValue[]
  message: string
  meta_data: WithdrawGroupValue
  time_stamp: number
  total_count: number
}

export class HealthStatusValue {
  status: string
}

@Exclude()
export class TransactionParams {
  @Expose()
  @ApiProperty({
    required: true,
  })
  transactionIds: string[]

  @Expose()
  @ApiPropertyOptional()
  status?: string
}

@Exclude()
export class DuplicateWithdrawRequest {
  @Expose({
    name: 'group_id',
  })
  @ApiProperty({
    required: true,
  })
  groupId: string

  @Expose({
    name: 'withdraw_request_ids',
  })
  @ApiProperty({
    required: true,
  })
  withdrawRequestIds: string[]
}

export class validateDuplicateWithdrawResponse {
  data: string[]
  message: string
  meta_data: WithdrawGroupValue
  time_stamp: number
  total_count: number
}

export class CollectBalanceResponse {
  data: { transaction_hash: string }
  message: string
  meta_data: {
    current_balance: string
    collect_balance: string
  }
  time_stamp: number
  total_count: number
}
