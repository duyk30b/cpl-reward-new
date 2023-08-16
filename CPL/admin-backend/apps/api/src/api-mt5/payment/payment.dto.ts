import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ListPayoutsRequestDTO {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  size: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export class PayoutDetailRequestDTO {
  @ApiProperty({ name: 'payout_id', required: false })
  @Expose({ name: 'payout_id' })
  payoutId: string
}

export class ApprovePayoutRequestDTO {
  @ApiProperty({ required: true, name: 'payout_id' })
  @Expose({ name: 'payout_id' })
  payoutId: string

  @ApiProperty({ required: true, name: 'cpl_id' })
  @Expose({ name: 'cpl_id' })
  cplId: string

  @ApiProperty({ required: true, name: 'mt5_login' })
  @Expose({ name: 'mt5_login' })
  mt5Login: string

  @ApiProperty({ required: true, name: 'remark' })
  @Expose({ name: 'remark' })
  remark: string

  @ApiProperty({ required: true, name: 'executor' })
  @Expose({ name: 'executor' })
  executor: string
}

export class RejectPayoutRequestDTO {
  @ApiProperty({ required: true, name: 'payout_id' })
  @Expose({ name: 'payout_id' })
  payoutId: string

  @ApiProperty({ required: true, name: 'cpl_id' })
  @Expose({ name: 'cpl_id' })
  cplId: string

  @ApiProperty({ required: true, name: 'mt5_login' })
  @Expose({ name: 'mt5_login' })
  mt5Login: string

  @ApiProperty({ required: true, name: 'remark' })
  @Expose({ name: 'remark' })
  remark: string

  @ApiProperty({ required: true, name: 'executor' })
  @Expose({ name: 'executor' })
  executor: string
}

export class ConfirmBankTransferPayoutRequestDTO {
  @ApiProperty({ required: true, name: 'payout_id' })
  @Expose({ name: 'payout_id' })
  payoutId: string

  @ApiProperty({ required: true, name: 'cpl_id' })
  @Expose({ name: 'cpl_id' })
  cplId: string

  @ApiProperty({ required: true, name: 'mt5_login' })
  @Expose({ name: 'mt5_login' })
  mt5Login: string

  @ApiProperty({ required: true, name: 'remark' })
  @Expose({ name: 'remark' })
  remark: string

  @ApiProperty({ required: true, name: 'executor' })
  @Expose({ name: 'executor' })
  executor: string
}

export class RejectBankTransferPayoutRequestDTO {
  @ApiProperty({ required: true, name: 'payout_id' })
  @Expose({ name: 'payout_id' })
  payoutId: string

  @ApiProperty({ required: true, name: 'cpl_id' })
  @Expose({ name: 'cpl_id' })
  cplId: string

  @ApiProperty({ required: true, name: 'mt5_login' })
  @Expose({ name: 'mt5_login' })
  mt5Login: string

  @ApiProperty({ required: true, name: 'remark' })
  @Expose({ name: 'remark' })
  remark: string

  @ApiProperty({ required: true, name: 'executor' })
  @Expose({ name: 'executor' })
  executor: string
}
