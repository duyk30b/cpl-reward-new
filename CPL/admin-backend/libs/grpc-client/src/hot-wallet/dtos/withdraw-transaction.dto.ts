import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity, GrpcHotWalletBaseResponse } from './base.dto'
import { ManualTransactionLogEntity } from './manual-transaction-log.dto'

export enum TRANSACTION_STATUS {
  REJECT = 'REJECT',
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  CONFIRMED = 'CONFIRMED',
  AMOUNT_REJECT = 'AMOUNT_REJECT',
  FAILED_SIGN = 'FAILED_SIGN',
  FAILED_CHECK_CONFIRMATION = 'FAILED_CHECK_CONFIRMATION',
  IN_SIGNING_QUEUE = 'IN_SIGNING_QUEUE',
  IN_CONFIRMATION_QUEUE = 'IN_CONFIRMATION_QUEUE',
  NO_AVAILABLE_PK = 'NO_AVAILABLE_PK',
  NO_AVAILABLE_PROVIDER = 'NO_AVAILABLE_PROVIDER',
  FAILED_BCE_VALIDATION = 'FAILED_BCE_VALIDATION',
  FAILED_POST_PROCESS = 'FAILED_POST_PROCESS',
  FAILED_NOTIFY_THIRD_PARTY = 'FAILED_NOTIFY_THIRD_PARTY',
}

export enum WITHDRAW_INTERACTOR {
  USER = 'USER',
  MOTHER = 'MOTHER',
}

export enum DOMAIN {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  COLLECTION = 'COLLECTION',
  INCIDENCE = 'INCIDENCE',
}

export class WithdrawTransactionDto extends BaseEntity {
  @ApiProperty({
    example: 'CONFIRMED',
    description: 'Status of transaction',
    enum: TRANSACTION_STATUS,
  })
  status: TRANSACTION_STATUS

  @ApiProperty({
    example: '0.2',
    description: 'Amount of withdraw request',
  })
  amount: string

  @Expose({
    name: 'parsed_amount',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '200000000000000000',
    description:
      'Amount in coin unit, example amount = 0.2 (ETH) will set parsed_amount = 200000000000000000 (Gwei)',
  })
  parsedAmount: string

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
    name: 'user_id',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '41410',
    description: 'User id from bce system',
  })
  userId: string

  @ApiProperty({
    example: 'testnet',
    description: 'Network of blockchain',
  })
  network: string

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
    example: '21',
    description: 'Number of confirmations for this transaction on blockchain',
  })
  confirmations: number

  @Expose({
    name: 'confirmation_passed',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: 'true',
    description: 'Has passed required confirmation number in setting',
  })
  confirmationPassed: boolean

  @Expose({
    name: 'confirmation_passed_date',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '1648714966267',
    description: 'Date of confirmation number passing required setting',
  })
  confirmationPassedDate: number

  @Expose({
    name: 'requested_date',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '1648714966267',
    description: 'Date requested this withdraw transaction',
  })
  requestedDate: number

  @Expose({
    name: 'signed_date',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '1648714966267',
    description: 'Date when successed signing and pushing on blockchain',
  })
  signedDate: number

  @ApiProperty({
    example: 'ADMIN',
    description: 'Verify who interact/trigger api withdraw',
    enum: WITHDRAW_INTERACTOR,
  })
  interactor: WITHDRAW_INTERACTOR

  @Expose({
    name: 'interactor_id',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '41410',
    description: 'ID of who interact/trigger api withdraw',
  })
  interactorId: string

  @ApiProperty({
    example: '0x37194eDff5851386A4...',
    description: 'Wallet address which send and publish this transaction',
  })
  from: string

  @ApiProperty({
    example: '0x7102eFD4D19b5cFac2...',
    description: 'Wallet address which received amount of this transaction',
  })
  to: string

  domain: DOMAIN

  @Expose({
    name: 'bce_transaction_id',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '45',
    description: 'Transaction id of bce system',
  })
  bceTransactionId: number

  @Expose()
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
}

export class GrpcGetWithdrawResponse extends GrpcHotWalletBaseResponse<
  WithdrawTransactionDto[],
  any
> {
  @Expose()
  data: WithdrawTransactionDto[]
}

export class RetryFailedWithdrawBaseDto {
  @Expose({ name: 'fee_limit' })
  @ApiProperty({
    name: 'fee_limit',
    example: 12,
    type: Number,
  })
  feeLimit: number

  @Expose({ name: 'gas_limit' })
  @ApiProperty({
    name: 'gas_limit',
    example: 9000,
    type: Number,
  })
  gasLimit: number
}

export class RetryFailedWithdrawDto extends RetryFailedWithdrawBaseDto {
  id: number

  @Expose({ name: 'admin_id' })
  adminId: number
}

export class GrpcRetryFailedWithdrawResponse extends GrpcHotWalletBaseResponse<
  any,
  any
> {
  data: boolean
}

export class StopProcessingWithdrawDto {
  @Expose({ name: 'transaction_id' })
  transactionId: number

  @Expose({ name: 'admin_id' })
  adminId: number
}

export class GrpcStopWithdrawResponse extends GrpcHotWalletBaseResponse<
  any,
  any
> {
  data: {
    result: boolean
  }
}

export class GrpcWithdrawByIdData {
  @Type(() => WithdrawTransactionDto)
  transaction: WithdrawTransactionDto

  @Type(() => ManualTransactionLogEntity)
  logs: Array<ManualTransactionLogEntity>
}

export class GrpcWithdrawByIdResponse extends GrpcHotWalletBaseResponse<
  any,
  any
> {
  data: {
    transction: WithdrawTransactionDto
    logs: Array<ManualTransactionLogEntity>
  }
}
