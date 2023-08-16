import {
  convertTimestampToDate,
  getCountryName,
} from '@/core/helpers/common.helper'
import BigNumber from 'bignumber.js'
import {
  Exclude,
  Expose,
  plainToClass,
  Transform,
  Type,
} from 'class-transformer'
import moment from 'moment'
import { BaseUserInfo } from '../user/UserInfo'

export class SendConfirmerDataModel {
  @Expose({ name: 'created_at' })
  @Transform(({ value }) => {
    return value ? moment.unix(+value / 1000).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  createdAt: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => {
    return value ? moment.unix(+value / 1000).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  updatedAt: string

  @Expose({ name: 'email' })
  email: string

  @Expose({ name: 'id' })
  id: string

  @Expose({ name: 'is_first_login' })
  isFirstLogin: boolean

  @Expose({ name: 'is_root' })
  isRoot: boolean

  @Expose({ name: 'name' })
  name: string
}
export class TransactionApprovalModel {
  @Expose({ name: 'id' })
  id: number

  @Expose({ name: 'amount' })
  @Transform(({ value }) => {
    return value ? new BigNumber(+value.replace(/-/, '')).toString() : '0'
  })
  amount: string

  @Expose({ name: 'approved_by' })
  approvedBy: string

  @Expose({ name: 'approve_at' })
  @Transform(({ value }) => {
    return value ? moment.unix(+value / 1000).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  approveAt: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => {
    return value ? moment.unix(+value / 1000).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  createdAt: string

  @Expose({ name: 'currency' })
  currency: string

  @Expose({ name: 'currency_fee' })
  currencyFee: string

  @Expose({ name: 'deny_by' })
  denyBy: string

  @Expose({ name: 'deny_at' })
  @Transform(({ value }) => {
    return value ? moment.unix(+value / 1000).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  denyAt: string

  @Expose({ name: 'send_confirmer1' })
  sendConfirmer1: string

  @Expose({ name: 'send_confirmer2' })
  sendConfirmer2: string

  @Expose({ name: 'send_confirmer1_data' })
  sendConfirmer1Data: SendConfirmerDataModel

  @Expose({ name: 'send_confirmer2_data' })
  sendConfirmer2Data: SendConfirmerDataModel

  @Exclude()
  @Expose({ name: 'sent_by' })
  sentBy: string

  @Expose({ name: 'sent_at' })
  @Transform(({ value }) => {
    return value ? moment.unix(+value / 1000).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  sentAt: number

  @Expose({ name: 'reject_by' })
  rejectBy: string

  @Expose({ name: 'remarks' })
  remarks: string

  @Expose({ name: 'reject_at' })
  @Transform(({ value }) => {
    return value ? moment.unix(+value / 1000).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  rejectAt: number

  @Expose({ name: 'fee' })
  fee: string

  @Expose({ name: 'from_address' })
  fromAddress: string

  @Expose({ name: 'status' })
  status: EApprovalStatus

  @Expose({ name: 'to_address' })
  toAddress: string

  @Expose({ name: 'destination_tag' })
  destinationTag: string

  @Expose({ name: 'transaction_date' })
  transactionDate: string

  @Expose({ name: 'transaction_id' })
  transactionId: string

  @Expose({ name: 'type' })
  type: EApprovalType

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => {
    return value ? moment.unix(+value / 1000).format('YYYY-MM-DD HH:mm:ss') : ''
  })
  updatedAt: number

  @Expose({ name: 'user_id' })
  userId: number

  @Expose({ name: 'tx_hash' })
  transactionHash?: string

  @Expose({ name: 'user' })
  @Transform(({ value }) => {
    const transformed = plainToClass(BaseUserInfo, value.user_info, {
      excludeExtraneousValues: true,
    })

    return {
      ...transformed,
      email: value.email,
      countryName: getCountryName(value.user_info.country_id),
      tel: value.user_info.tel,
    }
  })
  userInfo: BaseUserInfo & {
    email: string
    countryName: string
    tel: string
  }

  @Expose({ name: 'verify_code' })
  verifyCode: string

  @Expose({ name: 'withdrawal_type' })
  withdrawalType: string

  @Expose({ name: 'process_status' })
  processStatus: EApprovalProcessStatus

  @Expose({ name: 'process_type' })
  processType: number

  @Expose({ name: 'process_source_type' })
  processSourceType: string

  @Expose({ name: 'withdrawal_logs' })
  @Type(() => WithdrawalLogDto)
  withdrawalLogs: Array<WithdrawalLogDto>

  get isWithdrawalManual() {
    return (
      this.isWithdrawalManual === ETransactionType.HANDLE_AUTO_WITHDRAW_MANUALLY
    )
  }

  get toAddressFormatted() {
    if (this.currency === 'xrp' && this.destinationTag) {
      return `${this.toAddress}:${this.destinationTag}`
    }

    return this.toAddress
  }

  get sendConfirmers() {
    const sentByData: string[] = []

    if (this.sendConfirmer1Data && this.sendConfirmer1Data.email) {
      sentByData.push(this.sendConfirmer1Data.email)
    }

    if (this.sendConfirmer2Data && this.sendConfirmer2Data.email) {
      sentByData.push(this.sendConfirmer2Data.email)
    }

    return sentByData.join(', ')
  }
}

export class BceConfigTransactionApprovalDto {
  @Expose({
    name: 'highlow_total_checking',
  })
  highlowTotalChecking: number

  @Expose({
    name: 'highlow_winrate_limit',
  })
  highlowWinrateLimit: number

  @Expose({
    name: 'highlow_winrate_limit_percent',
  })
  highlowWinrateLimitPercent: number

  @Expose({
    name: 'highlow_profit_limit',
  })
  highlowProfitLimit: number

  @Expose({
    name: 'order_minutely_limit',
  })
  orderMinutelyLimit: number

  @Expose({
    name: 'order_daily_limit',
  })
  orderDailyLimit: number

  @Expose({
    name: 'order_usd_value_limit',
  })
  orderUsdValueLimit: number

  @Expose({
    name: 'manually_transaction_usd_value_limit',
  })
  manuallyTransactionUsdValueLimit: number
}
export class WithdrawalLogDto {
  @Expose({ name: 'created_at' })
  @Transform(({ value }) => convertTimestampToDate(value, 'YYYY-MM-DD HH:mm'))
  createdAt: string

  @Expose()
  status: string

  @Expose()
  message: string
}

export class ApproveTransactionPayload {
  @Expose({ name: 'transactionId' })
  transaction_id: string
}

export interface ITransactionParams {
  transactionId: number
}

export interface IApproveTransactionParams {
  transactionId: string
  action: ETransactionApproveAction
  remarks?: string
}

export interface IRemitTransactionParams {
  transactionId: string
  transactionHash: string
  sendConfirmer1?: string
  sendConfirmer2?: string
  remarks?: string
  processType?: EProcessType
}

export class TransactionParamsPayloadModel {
  @Expose({ name: 'transactionId' })
  transaction_id?: number
}

export class ApproveTransactionPayloadModel {
  @Expose({ name: 'transactionId' })
  transaction_id?: string

  @Expose({ name: 'action' })
  action: ETransactionApproveAction

  @Expose({ name: 'remarks' })
  remarks?: string
}

export class RemitTransactionPayloadModel {
  @Expose({ name: 'transactionId' })
  transaction_id?: string

  @Expose({ name: 'transactionHash' })
  tx_hash?: string

  @Expose({ name: 'sendConfirmer1' })
  send_confirmer1?: string

  @Expose({ name: 'sendConfirmer2' })
  send_confirmer2?: string

  @Expose({ name: 'remarks' })
  remarks?: string

  @Expose({ name: 'processType' })
  process_type?: EProcessType
}

export enum EApprovalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUCCESS = 'success',
  EXECUTING = 'executing',
  CANCELED = 'canceled',
  VERIFIED = 'verified',
  SUBMITTED = 'submitted',
  ERROR = 'error',
  CANCEL = 'cancel',
}

export enum ETransactionType {
  HANDLE_AUTO_WITHDRAW_MANUALLY = 'handle_auto_withdraw_manually',
}

export enum EApprovalType {
  WITHDRAWAL = 'withdrawal',
  DEPOSIT = 'deposit',
}

export enum EProcessType {
  HOT_WALLET = 'auto',
  MANUAL = 'manual',
}

export enum ETransactionApproveAction {
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum EApprovalProcessStatus {
  WALLET_AUTO_WITHDRAW_NEW_STATUS = 1,
  WALLET_AUTO_WITHDRAW_PROCESSING_STATUS = 2,
  WALLET_AUTO_WITHDRAW_SUCCESS_STATUS = 3,
  WALLET_AUTO_WITHDRAW_ERROR_STATUS = 4,
}

export enum EApprovalProcessType {
  MANUAL = 1,
  AUTO = 2,
}
