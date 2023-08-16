import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { Optional } from '@nestjs/common'
import { BALANCE_TYPE } from 'apps/api/src/api-balance/balance.enum'

export enum SWAP_STATUS {
  CREATED = 1,
  COMPLETED = 2,
  PENDING = 3,
  FAILED = 4,
}

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

export class SwapEntity {
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

  @ApiProperty({ name: 'exchange_from' })
  @Expose({ name: 'exchange_from', toPlainOnly: true })
  exchangeFrom: string

  @ApiProperty({ name: 'exchange_to' })
  @Expose({ name: 'exchange_to', toPlainOnly: true })
  exchangeTo: string

  @ApiProperty({ name: 'coin_from' })
  @Expose({ name: 'coin_from', toPlainOnly: true })
  coinFrom: string

  @ApiProperty({ name: 'coin_to' })
  @Expose({ name: 'coin_to', toPlainOnly: true })
  coinTo: string

  @ApiProperty({ name: 'rate' })
  @Expose({ name: 'rate', toPlainOnly: true })
  rate: string

  @ApiProperty({ name: 'amount' })
  @Expose({ name: 'amount', toPlainOnly: true })
  amount: string

  @ApiProperty({ name: 'fee' })
  @Expose({ name: 'fee', toPlainOnly: true })
  fee: string

  @ApiProperty({ name: 'received' })
  @Expose({ name: 'received', toPlainOnly: true })
  received: string

  @ApiProperty({ name: 'status' })
  @Expose({ name: 'status', toPlainOnly: true })
  @Transform(({ value }) => SWAP_STATUS[value], {
    toPlainOnly: true,
  })
  status: string

  @ApiProperty({ name: 'data_raw' })
  @Expose({ name: 'data_raw', toPlainOnly: true })
  dataRaw: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class ListBalanceSwapRequest {
  @ApiProperty({ required: false, name: 'user_ids' })
  @Optional()
  @Expose({ name: 'user_ids' })
  userIds: string

  @ApiProperty({ required: false, name: 'coin_from' })
  @Optional()
  @Expose({ name: 'coin_from' })
  coinFrom: string

  @ApiProperty({ required: false, name: 'coin_to' })
  @Optional()
  @Expose({ name: 'coin_to' })
  coinTo: string

  @ApiProperty({ required: false, name: 'start_date' })
  @Optional()
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ required: false, name: 'end_date' })
  @Optional()
  @Expose({ name: 'end_date' })
  endDate: string

  @ApiProperty({ required: false, name: 'status' })
  @Expose({ name: 'status' })
  @Transform(({ value }) => SWAP_STATUS[value], {
    toPlainOnly: true,
  })
  status: string

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

export class ListBalanceSwapResponse {
  @ApiProperty({ required: false, name: 'data' })
  @Expose({ name: 'data' })
  data: Array<SwapEntity>

  @ApiProperty({ required: false, name: 'pagination' })
  @Optional()
  @Expose({ name: 'pagination' })
  pagination?: PaginationDto
}
