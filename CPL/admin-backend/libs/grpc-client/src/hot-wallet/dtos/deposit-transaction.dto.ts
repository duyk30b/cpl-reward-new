import { Expose, Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  BaseEntity,
  BaseFilterQuery,
  GrpcHotWalletBaseResponse,
} from './base.dto'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { ManualTransactionLogEntity } from './manual-transaction-log.dto'

export enum DEPOSIT_STATUS {
  CONFIRMATION = 'CONFIRMATION',
  UN_CONFIRMATION = 'UN_CONFIRMATION',
  FAILED = 'FAILED',
}

export class DepositTransactionDto extends BaseEntity {
  @ApiProperty({
    example: 'CONFIRMATION',
    description: 'Status of transaction',
    enum: DEPOSIT_STATUS,
  })
  status: DEPOSIT_STATUS

  @ApiProperty({
    example: '0.2',
    description: 'Amount of deposit request',
  })
  amount: string

  @Expose({
    name: 'transaction_hash',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '0x568fba1f4a5601aa...',
    description: 'Hashing of transaction on blockchain',
  })
  transactionHash: string

  @Expose({
    name: 'wallet_address',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '0x7102eFD4D19b5cFac2...',
    description: 'Wallet address which received amount',
  })
  walletAddress: string

  @ApiProperty({
    example: 'testnet',
    description: 'Network of blockchain',
  })
  network: string

  @ApiProperty({
    description: 'Block number has included this transaction',
  })
  block: number

  @ApiProperty({
    example: '21',
    description: 'Number of confirmations for this transaction on blockchain',
  })
  confirmations: number

  @Expose({
    name: 'transaction_raw',
    toPlainOnly: true,
  })
  @ApiProperty({
    description: 'Raw transaction fetch from blockchain',
  })
  transactionRaw: string

  @Expose({
    name: 'chain_code',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: 'eth, btc, bch,...',
    description: 'Name of blockchain chain group',
  })
  chainCode: string

  @ApiProperty({
    example: 'eth, btc,...',
    description: 'Coin currency',
  })
  symbol: string

  @Expose({
    name: 'bce_transaction_transaction_id',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: 'd717197bf54b800866a2803f9fda1cc6af647da0',
    description: 'Transaction of bce system',
  })
  bceTransactionTransactionId: string

  @Expose({
    name: 'parsed_amount',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '20000000',
    description: 'Amount 0.2 of btc',
  })
  parsedAmount: string

  @Expose({
    name: 'queue_status',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: 'DONE',
    description: 'Status of deposit transaction: `PROCESSING` OR `DONE`',
  })
  queueStatus: string
}

export class GrpcGetDepositResponse extends GrpcHotWalletBaseResponse<
  DepositTransactionDto[],
  any
> {
  data: DepositTransactionDto[]
}

export class BaseFilterTransactionQuery extends BaseFilterQuery {
  @Expose({
    name: 'search_address',
  })
  searchAddress?: string

  @Expose({
    name: 'search_transaction_hash',
  })
  searchTransactionHash?: string

  @Expose({
    name: 'search_transaction_id',
  })
  searchTransactionId?: string

  @Expose({
    name: 'from_date',
  })
  fromDate?: string

  @Expose({
    name: 'to_date',
  })
  toDate?: string
}

export class CreateManualDepositDto {
  @Expose({ name: 'chain_code' })
  @ApiProperty({
    name: 'chain_code',
    example: 'eth',
  })
  @IsNotEmpty()
  chainCode: string

  @Expose()
  @ApiProperty({
    example: 'eth',
  })
  @IsNotEmpty()
  symbol: string

  @Expose({ name: 'transaction_hash' })
  @ApiProperty({
    example: '0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405',
    name: 'transaction_hash',
  })
  @IsNotEmpty()
  transactionHash: string
}

export class CreateManualDepositBodyDto extends CreateManualDepositDto {
  @Expose({ name: 'admin_id' })
  adminId: number
}

export class RetryDepositDto {
  @Expose({
    name: 'admin_id',
  })
  adminId: number

  @Expose({
    name: 'transaction_id',
  })
  transactionId: number
}

export class GrpcDepositByIdData {
  @Type(() => DepositTransactionDto)
  transaction: DepositTransactionDto

  @Type(() => ManualTransactionLogEntity)
  logs: Array<ManualTransactionLogEntity>
}

export class GrpcDepositByIdResponse extends GrpcHotWalletBaseResponse<
  any,
  any
> {
  @Expose()
  data: GrpcDepositByIdData
}
