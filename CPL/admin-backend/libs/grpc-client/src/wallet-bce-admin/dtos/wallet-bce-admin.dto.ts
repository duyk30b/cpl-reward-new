import { Exclude, Expose, Transform, Type } from 'class-transformer'
import {
  BaseEntity,
  GrpcHotWalletBaseResponse,
} from '@lib/grpc-client/hot-wallet/dtos'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SORT_TYPE } from '@app/common/base-pagination.dto'
import { Admin } from '@lib/admin'

export class BceExternalWithdrawDto extends BaseEntity {
  @Expose()
  type?: BCE_WITHDRAW_TRANSACTION_TYPE
  @Expose()
  currency: string
  @Expose()
  amount: string //* Negative means withdraw. Positive means deposit
  @Expose()
  sender: string
  @Expose()
  remarks?: string

  @Expose({
    name: 'transaction_id',
    toPlainOnly: true,
  })
  transactionId: string

  @Expose({
    name: 'user_id',
    toPlainOnly: true,
  })
  userId: number

  @Expose({
    name: 'tx_hash',
    toPlainOnly: true,
  })
  txHash?: string

  @Expose({
    name: 'currency_fee',
    toPlainOnly: true,
  })
  currencyFee?: string

  @Expose()
  fee: string

  @Expose()
  status: string

  @Expose({
    name: 'from_address',
    toPlainOnly: true,
  })
  fromAddress?: string

  @Expose({
    name: 'to_address',
    toPlainOnly: true,
  })
  toAddress?: string

  @Expose()
  network?: string

  @Expose({
    name: 'blockchain_address',
    toPlainOnly: true,
  })
  blockchainAddress?: string

  @Expose({
    name: 'destination_tag',
    toPlainOnly: true,
  })
  destinationTag?: string

  @Expose({
    name: 'verify_code',
    toPlainOnly: true,
  })
  verifyCode?: string

  @Expose({
    name: 'is_external',
    toPlainOnly: true,
  })
  isExternal: number

  @Expose({
    name: 'approved_by',
    toPlainOnly: true,
  })
  approvedBy?: string

  @Expose({
    name: 'approve_at',
    toPlainOnly: true,
  })
  approveAt?: number

  @Expose({
    name: 'deny_by',
    toPlainOnly: true,
  })
  denyBy?: string

  @Expose({
    name: 'deny_at',
    toPlainOnly: true,
  })
  denyAt?: number

  @Expose({
    name: 'send_confirmer1',
    toPlainOnly: true,
  })
  sendConfirmer1?: number

  @Expose({
    name: 'send_confirmer1_data',
    toPlainOnly: true,
  })
  sendConfirmer1Data: Admin

  @Expose({
    name: 'send_confirmer2',
    toPlainOnly: true,
  })
  sendConfirmer2?: number

  @Expose({
    name: 'send_confirmer2_data',
    toPlainOnly: true,
  })
  sendConfirmer2Data: Admin

  @Expose({
    name: 'sent_by',
    toPlainOnly: true,
  })
  sentBy?: string

  @Expose({
    name: 'sent_at',
    toPlainOnly: true,
  })
  sentAt?: number

  @Expose({
    name: 'reject_by',
    toPlainOnly: true,
  })
  rejectBy?: string

  @Expose({
    name: 'reject_at',
    toPlainOnly: true,
  })
  rejectAt?: number

  @Expose({
    name: 'cancel_at',
    toPlainOnly: true,
  })
  cancelAt?: number

  @Expose({
    name: 'error_detail',
    toPlainOnly: true,
  })
  errorDetail?: string

  @Expose({
    name: 'transaction_date',
    toPlainOnly: true,
  })
  transactionDate: string

  @Expose({
    name: 'withdrawal_type',
    toPlainOnly: true,
  })
  withdrawalType?: string

  @Expose({
    name: 'withdraw_approval',
    toPlainOnly: true,
  })
  withdrawApproval?: string

  @Expose({
    name: 'hold_amount_transaction_id',
    toPlainOnly: true,
  })
  holdAmountTransactionId: string

  @Expose({
    name: 'hold_fee_transaction_id',
    toPlainOnly: true,
  })
  holdFeeTransactionId?: string

  @Expose({
    name: 'email',
  })
  email?: string

  @Expose({
    name: 'process_type',
    toPlainOnly: true,
  })
  processType?: number

  @Expose({
    name: 'process_status',
    toPlainOnly: true,
  })
  processStatus?: number

  @Expose({
    name: 'withdrawal_logs',
    toPlainOnly: true,
  })
  @Type(() => WithdrawalLogEnity)
  withdrawalLogs: Array<WithdrawalLogEnity>
}

export class WithdrawalLogEnity {
  status: string
  message: string
  @Expose({
    name: 'created_at',
    toPlainOnly: true,
  })
  createdAt: string
}

class BceUserInfoDto extends BaseEntity {
  @Expose({
    name: 'user_id',
    toPlainOnly: true,
  })
  userId: number

  @Expose({
    name: 'user_info_history_id',
    toPlainOnly: true,
  })
  userInfoHistoryId: number

  @Expose({
    name: 'first_name',
    toPlainOnly: true,
  })
  firstName: string

  @Expose({
    name: 'last_name',
    toPlainOnly: true,
  })
  lastName: string

  @Expose({
    name: 'full_name',
    toPlainOnly: true,
  })
  fullName: string

  @Expose({
    name: 'furigana_1',
    toPlainOnly: true,
  })
  furigana1: string
  @Expose({
    name: 'furigana_2',
    toPlainOnly: true,
  })
  furigana2: number

  @Expose()
  birthday: string

  @Expose()
  phone: number

  @Expose({
    name: 'phone_country',
    toPlainOnly: true,
  })
  phoneCountry: number

  @Expose({
    name: 'building_room',
    toPlainOnly: true,
  })
  buildingRoom: string

  @Expose()
  address: string

  @Expose()
  city: string

  @Expose({
    name: 'state_region',
    toPlainOnly: true,
  })
  stateRegion: string

  @Expose({
    name: 'zip_code',
    toPlainOnly: true,
  })
  zipCode: number

  @Expose({
    name: 'country_id',
    toPlainOnly: true,
  })
  countryId: number

  @Expose({
    name: 'nationality_id',
    toPlainOnly: true,
  })
  nationalityId: number

  @Expose()
  gender: number

  @Expose()
  tel: string

  @Expose({
    name: 'region_code',
    toPlainOnly: true,
  })
  regionCode: string
}

class BceUserDto extends BaseEntity {
  @Expose()
  uuid: string
  @Expose()
  email: string
  @Expose()
  status: number

  @Expose({
    name: 'referrer_code',
    toPlainOnly: true,
  })
  referrerCode: string
  @Expose({
    name: 'dynamic_link',
    toPlainOnly: true,
  })
  dynamicLink: string

  @Expose({
    name: 'last_login',
    toPlainOnly: true,
  })
  lastLogin: number

  @Expose()
  type: number

  @Expose({
    name: 'email_verify_at',
    toPlainOnly: true,
  })
  emailVerifyAt: number

  @Expose({
    name: 'email_verify_status',
    toPlainOnly: true,
  })
  emailVerifyStatus: number

  @Expose({
    name: 'authenticator_verify_at',
    toPlainOnly: true,
  })
  authenticatorVerifyAt: number

  @Expose({
    name: 'authenticator_verify_status',
    toPlainOnly: true,
  })
  authenticatorVerifyStatus: number

  @Expose({
    name: 'kyc_verify_status',
    toPlainOnly: true,
  })
  kycVerifyStatus: number

  @Expose({
    name: 'user_info_status',
    toPlainOnly: true,
  })
  userInfoStatus: number

  @Expose({
    name: 'last_password_change',
    toPlainOnly: true,
  })
  lastPasswordChange: number

  @Expose({
    name: 'accept_law_status',
    toPlainOnly: true,
  })
  acceptLawStatus: number

  @Expose({
    name: 'account_lv',
    toPlainOnly: true,
  })
  accountLv: number

  @Expose({
    name: 'is_banned',
    toPlainOnly: true,
  })
  isBanned: boolean

  @Expose({
    name: 'user_info',
    toPlainOnly: true,
  })
  @Type(() => BceUserInfoDto)
  userInfo: BceUserInfoDto
}

export class BceTransactionDetailRequest {
  @Expose({
    name: 'transaction_id',
  })
  @ApiProperty({ name: 'transaction_id', default: 'ec7330a1af7c23dee38a' })
  transactionId: string
}

export class BceTransactionDetail extends BceExternalWithdrawDto {
  @Type(() => BceUserDto)
  user: BceUserDto
}

export class GrpcBceTransactionDetailResponse extends GrpcHotWalletBaseResponse<
  BceTransactionDetail,
  any
> {
  data: BceTransactionDetail
}

export enum REMITTANCE_PROCESS_TYPE {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export enum BCE_WITHDRAW_TRANSACTION_TYPE {
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

export class BceExternalWithdrawRequest {
  @Expose()
  page: number

  @Expose()
  limit: number

  @Expose()
  sort?: string

  @Expose({
    name: 'sort_type',
  })
  sortType?: string

  @Expose({
    name: 'timezone_offset',
  })
  timezoneOffset?: number

  @Expose({
    name: 'selected_search',
  })
  selectedSearch?: string

  @Expose()
  type: BCE_WITHDRAW_TRANSACTION_TYPE

  @Expose()
  email?: string

  @Expose()
  coin?: string

  @Expose({
    name: 'transaction_id',
  })
  transactionId?: string

  @Expose({
    name: 'from_date',
  })
  fromDate?: string

  @Expose({
    name: 'to_date',
  })
  toDate?: string
}

export class GrpcBceExternalWithdrawResponse extends GrpcHotWalletBaseResponse<
  BceExternalWithdrawDto[],
  any
> {
  data: BceExternalWithdrawDto[]
}

/**
 * history deposit, withdraw
 */
export class GrpcDepositHistoryResponse extends GrpcHotWalletBaseResponse<
  BceExternalWithdrawDto[],
  any
> {
  data: BceExternalWithdrawDto[]
}

/**
 * @deprecated
 */
export class BceTransactionDto extends BaseEntity {
  @Expose()
  email: string
  @Expose()
  currency: string
  @Expose()
  fee: string
  @Expose()
  status: string
  @Expose()
  amount: string

  @Expose({
    name: 'transaction_id',
    toPlainOnly: true,
  })
  transactionId: string

  @Expose({
    name: 'tx_hash',
    toPlainOnly: true,
  })
  txHash: string

  @Expose({
    name: 'to_address',
    toPlainOnly: true,
  })
  toAddress: string

  @Expose()
  network: string
}
export class BceDepositHistoryRequest {
  @Expose()
  sort?: string

  @Expose({
    name: 'sort_type',
  })
  sortType?: string

  @Expose({
    name: 'start_date',
  })
  startDate?: string

  @Expose({
    name: 'end_date',
  })
  endDate?: string

  @Expose({
    name: 'search_key',
  })
  searchKey?: string

  @Expose({
    name: 'selected_search',
  })
  selectedSearch?: string

  @Expose({
    name: 'coin',
  })
  coin?: string

  @Expose({
    name: 'transaction_id',
  })
  transactionId?: string

  @Expose({
    name: 'email',
  })
  email?: string

  @Expose({
    name: 'tx_hash',
  })
  txHash?: string

  @Expose()
  page?: number

  @Expose()
  limit?: number

  @Expose()
  status?: string
}

export class BceWithdrawHistoryRequest {
  @Expose()
  sort: string

  @Expose({
    name: 'sort_type',
  })
  sortType: string

  @Expose({
    name: 'start_date',
  })
  startDate: string

  @Expose({
    name: 'end_date',
  })
  endDate: string

  @Expose({
    name: 'search_key',
  })
  searchKey: string

  @Expose({
    name: 'selected_search',
  })
  selectedSearch: string

  @Expose()
  status: string

  @Expose({
    name: 'timezone_offset',
  })
  timezoneOffset: number

  @Expose({
    name: 'coin',
  })
  coin?: string

  @Expose({
    name: 'transaction_id',
  })
  transactionId?: string

  @Expose({
    name: 'email',
  })
  email?: string

  @Expose({
    name: 'tx_hash',
  })
  txHash?: string

  @Expose()
  page: number
  @Expose()
  limit: number
}

export class GrpcWithdrawHistoryResponse extends GrpcHotWalletBaseResponse<
  BceExternalWithdrawDto[],
  any
> {
  data: BceExternalWithdrawDto[]
}
/**
 * File export
 */
export class BceExportFileRequest {
  @Expose()
  page: number
  @Expose()
  limit: number
}

export class BceDownloadFileExportRequest {
  @Expose()
  path: string

  @Expose({
    name: 'file_name',
  })
  fileName: string
}

export class BceDownloadFileExportResponse extends GrpcHotWalletBaseResponse<
  Record<string, string>,
  any
> {
  data: Record<string, string>
}

export class GrpcBceListExportFileResponse extends GrpcHotWalletBaseResponse<
  BceExportFileDto[],
  any
> {
  data: BceExportFileDto[]
}

export class GrpcBceExportFileResponse extends GrpcHotWalletBaseResponse<
  BceExportFileDto,
  any
> {
  data: BceExportFileDto
}
export class GrpcBceConfigTransactionApprovalResponse extends GrpcHotWalletBaseResponse<
  BceConfigTransactionApprovalDto,
  any
> {
  data: BceConfigTransactionApprovalDto
}

export class BceConfigTransactionApprovalDto {
  @Expose({
    name: 'highlow_total_checking',
    toPlainOnly: true,
  })
  highlowTotalChecking: number

  @Expose({
    name: 'highlow_winrate_limit',
    toPlainOnly: true,
  })
  highlowWinrateLimit: number

  @Expose({
    name: 'highlow_winrate_limit_percent',
    toPlainOnly: true,
  })
  highlowWinrateLimitPercent: number

  @Expose({
    name: 'highlow_profit_limit',
    toPlainOnly: true,
  })
  highlowProfitLimit: number

  @Expose({
    name: 'order_minutely_limit',
    toPlainOnly: true,
  })
  orderMinutelyLimit: number

  @Expose({
    name: 'order_daily_limit',
    toPlainOnly: true,
  })
  orderDailyLimit: number

  @Expose({
    name: 'order_usd_value_limit',
    toPlainOnly: true,
  })
  orderUsdValueLimit: number

  @Expose({
    name: 'manually_transaction_usd_value_limit',
    toPlainOnly: true,
  })
  manuallyTransactionUsdValueLimit: number
}

export class BceExportFileDto extends BaseEntity {
  @Expose({
    name: 'admin_id',
    toPlainOnly: true,
  })
  adminId: string

  @Expose({
    name: 'file_name',
    toPlainOnly: true,
  })
  fileName: string

  @Expose()
  path: string
  @Expose()
  status: string
}
/**
 * * Withdrawal security
 */

export class BceBaseWithdrawalSecurityResponse {
  @Expose()
  result: number
}

export class GrpcBceBaseWithdrawalSecurityResponse extends GrpcHotWalletBaseResponse<
  BceBaseWithdrawalSecurityResponse,
  any
> {
  data: BceBaseWithdrawalSecurityResponse
}

export class BceUserBalanceResponse extends BceBaseWithdrawalSecurityResponse {
  @Expose()
  dbValue: string
  @Expose()
  diff: string
  @Expose()
  logicValue: string
}

export class GrpcBceUserBalanceResponse extends GrpcHotWalletBaseResponse<
  BceUserBalanceResponse,
  any
> {
  data: BceUserBalanceResponse
}

export class BceWithdrawalSecurityRequest {
  @Expose({
    name: 'user_id',
  })
  userId: string
}

export class BceGetUserBalanceRequest extends BceWithdrawalSecurityRequest {
  @Expose()
  currency: string
}

export class BceBOTotalRecordResponse {
  @Expose()
  total: number
  @Expose()
  win: number
  @Expose()
  lost: number
}

export class GrpcBceBOTotalRecordResponse extends GrpcHotWalletBaseResponse<
  BceBOTotalRecordResponse,
  any
> {
  data: BceBOTotalRecordResponse
}

export class BceBOProfitResponse {
  profit: number
}

export class GrpcBceBOProfitResponse extends GrpcHotWalletBaseResponse<
  BceBOProfitResponse,
  any
> {
  data: BceBOProfitResponse
}

export class BceApproveTransactionRequest {
  @Expose({
    name: 'transaction_id',
  })
  transactionId: string

  @Expose()
  action:
    | BCE_WITHDRAW_TRANSACTION_TYPE.VERIFIED
    | BCE_WITHDRAW_TRANSACTION_TYPE.REJECTED
  @Expose()
  remarks?: string
}

export class BceApproveTransactionResponse {
  @Expose()
  data: string
}

export class GrpcBceApproveTransactionResponse extends GrpcHotWalletBaseResponse<
  BceApproveTransactionResponse,
  any
> {
  data: BceApproveTransactionResponse
}

export class BceRegistrationRemittanceRequest {
  @Expose({
    name: 'transaction_id',
  })
  @ApiProperty({
    name: 'transaction_id',
    default: 'ec7330a1af7c23dee38a7cac',
  })
  transactionId: string

  @Expose({
    name: 'tx_hash',
  })
  @ApiProperty({
    name: 'tx_hash',
    default: '0xec7330a1af7c23dee38a7cac',
    required: false,
  })
  txHash: string

  @Expose()
  @ApiProperty({
    default: 'Remark text',
    required: false,
  })
  remarks?: string

  @Expose({
    name: 'send_confirmer1',
  })
  @ApiProperty({
    name: 'send_confirmer1',
    default: 10,
    required: false,
  })
  sendConfirmer1: number

  @Expose({
    name: 'send_confirmer2',
  })
  @ApiProperty({
    name: 'send_confirmer2',
    default: 10,
    required: false,
  })
  sendConfirmer2: number

  @Expose({
    name: 'process_type',
  })
  @ApiProperty({
    name: 'process_type',
    default: 'auto',
  })
  @IsEnum(REMITTANCE_PROCESS_TYPE)
  processType: string
}

export class UpdateWithdrawalSettingParams {
  @Expose()
  @IsNotEmpty()
  coin: string

  @Expose({ name: 'withdrawal_enable' })
  @IsNotEmpty()
  @Transform(({ value }) => (value ? true : false), { toClassOnly: true })
  withdrawalEnable: boolean

  @Expose({ name: 'minimum_withdrawal' })
  @IsNotEmpty()
  @IsNumberString()
  minimumWithdrawal: string

  @Expose({ name: 'limit_amount' })
  @IsNotEmpty()
  @IsNumberString()
  limitAmount: string

  @Expose({ name: 'limit_time' })
  @IsNumber()
  limitTime: number

  @Expose({ name: 'fee_usdt_amount' })
  @IsNumberString()
  feeUsdtAmount: string

  @Expose({ name: 'fee_usdt_castle_amount' })
  @IsNumberString()
  feeUsdtCastleAmount: string

  @Expose({ name: 'fee_mode' })
  feeMode: string

  @Expose({ name: 'fee_settings' })
  @Type(() => WithdrawFeeSettingItemParams)
  @ValidateNested()
  feeSettings: WithdrawFeeSettingItemParams[]

  @Expose({ name: 'auto_withdrawal_threshold' })
  @IsNumberString()
  autoWithdrawalThreshold: string

  @Expose({ name: 'decimal_of_fee' })
  @IsNumberString()
  decimalOfFee: string
}

export class WithdrawFeeSettingItemParams {
  @Expose()
  network: string

  @Expose()
  symbol: string

  @Type(() => WithdrawalFeeItemParams)
  @Expose()
  @ValidateNested()
  fees: WithdrawalFeeItemParams[]
}

export class WithdrawalFeeItemParams {
  @Expose({ name: 'fee_amount' })
  @IsNumberString()
  @IsNotEmpty()
  feeAmount: string

  @IsString()
  @Expose({ name: 'fee_type' })
  feeType: string

  @IsBoolean()
  @IsNotEmpty()
  @Expose({ name: 'is_active' })
  isActive: boolean

  @Expose({ name: 'fee_amount_base_usdt' })
  @IsNumberString()
  @IsNotEmpty()
  feeAmountBaseUsdt: string
}

export class WithdrawalSettingEntity {
  id: string
  coin: string

  @Expose({ name: 'withdrawal_enable', toPlainOnly: true })
  withdrawalEnable: boolean

  @Expose({ name: 'minimum_withdrawal', toPlainOnly: true })
  minimumWithdrawal: string

  @Expose({ name: 'limit_amount', toPlainOnly: true })
  limitAmount: string

  @Expose({ name: 'limit_time', toPlainOnly: true })
  limitTime: string

  @Expose({ name: 'auto_withdrawal_threshold', toPlainOnly: true })
  autoWithdrawalThreshold: string

  @Expose({ name: 'fee_mode', toPlainOnly: true })
  feeMode: string

  @Expose({ name: 'fee_usdt_amount', toPlainOnly: true })
  feeUsdtAmount: string

  @Expose({ name: 'fee_usdt_castle_amount', toPlainOnly: true })
  feeUsdtCastleAmount: string

  @Expose({ name: 'fee_settings', toPlainOnly: true })
  @Type(() => WithdrawFeeSettingItem)
  feeSettings: WithdrawFeeSettingItem[]

  @Expose({ name: 'decimal_of_fee', toPlainOnly: true })
  decimalOfFee: string
}

export class WithdrawFeeSettingItem {
  @Expose()
  network: string

  @Expose()
  symbol: string

  @Type(() => WithdrawalFeeItem)
  @Expose()
  @ValidateNested()
  fees: WithdrawalFeeItem[]
}

export class WithdrawalFeeItem {
  @Expose({ name: 'fee_amount', toPlainOnly: true })
  @IsNumberString()
  @IsNotEmpty()
  feeAmount: string

  @IsString()
  @Expose({ name: 'fee_type', toPlainOnly: true })
  feeType: string

  @IsBoolean()
  @IsNotEmpty()
  @Expose({ name: 'is_active', toPlainOnly: true })
  isActive: boolean

  @Expose({ name: 'fee_amount_base_usdt', toPlainOnly: true })
  @IsNumberString()
  @IsNotEmpty()
  feeAmountBaseUsdt: string
}

export class UpdateWithdrawalSettingResponse {
  result: boolean
  @Type(() => WithdrawalSettingEntity)
  item: WithdrawalSettingEntity
  message: string
}

export class GetGlobalSettingResponse {
  @Expose({ name: 'usdt_fee', toPlainOnly: true })
  usdtFee: string

  @Expose({ name: 'usdt_fee_castle', toPlainOnly: true })
  usdtFeeCastle: string
}

export class SettingPaginationRequest {
  @Expose({ name: 'per_page' })
  @ApiProperty({
    name: 'per_page',
    required: false,
  })
  perPage: number

  @Expose()
  @ApiProperty({
    required: false,
  })
  page: number

  @ApiPropertyOptional({
    name: 'sort_type',
    type: String,
    default: 'ASC',
  })
  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => SORT_TYPE[value] || SORT_TYPE.ASC, {
    toClassOnly: true,
  })
  sortType: number

  @ApiPropertyOptional({
    type: String,
    default: '',
  })
  @Expose()
  sort: string

  @ApiPropertyOptional({
    type: String,
    default: '',
  })
  @Expose()
  search: string
}

export class PaginationResponse {
  @Expose()
  page: number
  @Expose()
  size: number
  @Expose()
  total: number
}

export class WithdrawalSettingPaginationResponse {
  @Expose()
  @Type(() => PaginationResponse)
  pagination: PaginationResponse

  @Expose()
  @Type(() => WithdrawalSettingEntity)
  items: WithdrawalSettingEntity[]
}

export class GrpcWithdrawalSettingPaginationResponse extends GrpcHotWalletBaseResponse<
  WithdrawalSettingPaginationResponse,
  any
> {
  data: WithdrawalSettingPaginationResponse
}

export class GrpcUpdateWithdrawalSettingResponse extends GrpcHotWalletBaseResponse<
  UpdateWithdrawalSettingResponse,
  any
> {
  data: UpdateWithdrawalSettingResponse
}

export class GrpcGetGlobalSettingResponse extends GrpcHotWalletBaseResponse<
  GetGlobalSettingResponse,
  any
> {
  data: GetGlobalSettingResponse
}

export const UpdateWithdrawalSettingBodyExample = {
  coin: 'btc',
  withdrawal_enable: true,
  minimum_withdrawal: '0.01',
  limit_amount: '1000000',
  limit_time: 1,
  fee_mode: 'COIN',
  fee_usdt_amount: '0.001',
  fee_usdt_castle_amount: '0.001',
  auto_withdrawal_threshold: '5',
  decimal_of_fee: '0.01',
  fee_settings: [
    {
      network: 'btc',
      symbol: 'btc',
      fees: [
        {
          fee_amount: '0.001',
          fee_type: 'NATIVE',
          is_active: true,
          fee_amount_base_usdt: '2.5',
        },
      ],
    },
  ],
}

@Exclude()
export class AdminEntityDto {
  @Expose()
  @Transform(({ value }) => (value ? parseInt(value) : value))
  id: string

  @Expose()
  name: string

  @Expose()
  email: string
}

export class GlobalUsdtFeeSettingParams {
  @ApiProperty({
    name: 'usdt_fee_amount',
    type: String,
    example: '40.5',
  })
  @Expose({ name: 'usdt_fee_amount' })
  usdtFeeAmount: string

  @ApiProperty({
    name: 'usdt_fee_castle_amount',
    type: String,
    example: '40.5',
  })
  @Expose({ name: 'usdt_fee_castle_amount' })
  usdtFeeCastleAmount: string

  @ApiProperty({
    type: Array,
    example: ['btc', 'eth'],
  })
  @Expose({ name: 'coins' })
  coins?: Array<string> = []
}
