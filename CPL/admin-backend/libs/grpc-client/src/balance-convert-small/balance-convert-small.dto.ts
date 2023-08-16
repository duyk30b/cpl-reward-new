import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { BALANCE_TYPE } from 'apps/api/src/api-balance/balance.enum'
import { Optional } from '@nestjs/common'

export class PaginationDto {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  size: number

  @ApiProperty()
  @Expose()
  total: number
}

export class BalanceConvertSmall {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @ApiProperty({ name: 'balance_type' })
  @Expose({ name: 'balance_type', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceType: string

  @ApiProperty({ name: 'total_received' })
  @Expose({ name: 'total_received', toPlainOnly: true })
  totalReceived: string

  @ApiProperty({ name: 'fee_coin' })
  @Expose({ name: 'fee_coin', toPlainOnly: true })
  feeCoin: string

  @ApiProperty({ name: 'total_fee' })
  @Expose({ name: 'total_fee', toPlainOnly: true })
  totalFee: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string
}

export class BalanceConvertSmallDetail {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @ApiProperty({ name: 'convert_small_id' })
  @Expose({ name: 'convert_small_id', toPlainOnly: true })
  convertSmallId: string

  @ApiProperty({ name: 'coin_from' })
  @Expose({ name: 'coin_from', toPlainOnly: true })
  coinFrom: string

  @ApiProperty({ name: 'coin_to' })
  @Expose({ name: 'coin_to', toPlainOnly: true })
  coinTo: string

  @ApiProperty({ name: 'balance_type' })
  @Expose({ name: 'balance_type', toPlainOnly: true })
  @Transform(({ value }) => BALANCE_TYPE[value], { toPlainOnly: true })
  balanceType: string

  @ApiProperty({ name: 'amount_from' })
  @Expose({ name: 'amount_from', toPlainOnly: true })
  amountFrom: string

  @ApiProperty({ name: 'amount_to' })
  @Expose({ name: 'amount_to', toPlainOnly: true })
  amountTo: string

  @ApiProperty({ name: 'fee_coin' })
  @Expose({ name: 'fee_coin', toPlainOnly: true })
  feeCoin: string

  @ApiProperty({ name: 'fee_amount' })
  @Expose({ name: 'fee_amount', toPlainOnly: true })
  feeAmount: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string
}

export class ListBalanceConvertSmallRequest {
  @ApiProperty({
    required: false,
  })
  @Optional()
  @Expose({ name: 'currencies' })
  currencies: string

  @ApiProperty({ required: false, name: 'user_ids' })
  @Optional()
  @Expose({ name: 'user_ids' })
  userIds: string

  @ApiProperty({ required: false, name: 'balance_type_from' })
  @Optional()
  @Expose({ name: 'balance_type_from' })
  balanceTypeFrom: string

  @ApiProperty({ required: false, name: 'start_date' })
  @Optional()
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ required: false, name: 'end_date' })
  @Optional()
  @Expose({ name: 'end_date' })
  endDate: string

  @ApiProperty({
    required: false,
  })
  @Optional()
  @Expose()
  page: number

  @ApiProperty({
    required: false,
  })
  @Optional()
  @Expose()
  size: number

  @ApiProperty({
    required: false,
  })
  @Expose()
  sort: string

  @ApiProperty({
    name: 'sort_type',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @Optional()
  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => (value ? value.toUpperCase() : null))
  sortType?: 'ASC' | 'DESC'
}

export class DetailBalanceConvertSmallRequest {
  @ApiProperty()
  @Expose({ name: 'convert_small_id' })
  convertSmallId: string
}
export class DetailBalanceConvertSmallByIdsRequest {
  @ApiProperty()
  @Expose({ name: 'convert_small_ids' })
  convertSmallIds: string[]
}
