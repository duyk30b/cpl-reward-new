import { EValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumberString, IsString } from 'class-validator'
import {
  BALANCE_TYPE,
  VALIDATION_ERRORS,
  TRANSACTION_TYPE,
  SORT_TYPE,
} from '../balance.enum'
import { Optional } from '@nestjs/common'

export class CreateTransactionRequest {
  @Expose()
  @IsNotEmpty()
  @IsNumberString({}, { message: EValidationError.IS_NUMBER })
  @ApiProperty({
    example: '1234',
  })
  user_id: string

  @Expose()
  @IsNotEmpty()
  @IsNumberString({}, { message: EValidationError.IS_NUMBER })
  @ApiProperty({
    example: '1234',
  })
  admin_id: string

  @Expose()
  @IsNumberString({}, { message: EValidationError.IS_NUMBER })
  @ApiProperty({
    example: '213312',
  })
  amount: string

  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    example: 'btc',
  })
  currency: string

  @ApiProperty({ enum: BALANCE_TYPE })
  @Expose()
  @IsEnum(BALANCE_TYPE, { message: VALIDATION_ERRORS.BALANCE_TYPE_IS_ENUM })
  @IsString({ message: VALIDATION_ERRORS.BALANCE_TYPE_IS_ENUM })
  balance_type: string
}

export class BalanceChangeHistoryRequest {
  @ApiProperty({ name: 'search_text', required: false })
  @Optional()
  @Expose({ name: 'search_text' })
  @Transform(({ value }) => value && value.toLowerCase())
  searchText: string

  @ApiProperty({ name: 'currency', required: false })
  @Optional()
  @Expose()
  @Transform(({ value }) => value && value.toLowerCase())
  currency: string

  @ApiProperty({
    name: 'transaction_type',
    enum: [
      TRANSACTION_TYPE.UNKNOWN,
      TRANSACTION_TYPE.MANUALLY,
      TRANSACTION_TYPE.IMPORT_EXCEL,
    ],
  })
  @Optional()
  @Expose({ name: 'transaction_type' })
  @Transform(({ value }) =>
    typeof TRANSACTION_TYPE[value] === 'number'
      ? TRANSACTION_TYPE[value]
      : +value,
  )
  transactionType: TRANSACTION_TYPE

  @ApiProperty({
    name: 'user_ids',
    required: false,
    type: [Number],
  })
  @Expose({ name: 'user_ids' })
  userIds: number[]

  @ApiProperty({
    name: 'page',
    required: false,
  })
  @Optional()
  @Expose()
  page: number

  @ApiProperty({
    name: 'limit',
    required: false,
  })
  @Optional()
  @Expose()
  limit: number

  @ApiProperty({
    name: 'sort',
    required: false,
  })
  @Expose()
  sort: string

  @ApiProperty({
    name: 'sort_type',
    required: false,
    enum: SORT_TYPE,
  })
  @Optional()
  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => (value ? value.toUpperCase() : null))
  sortType: SORT_TYPE = SORT_TYPE.DESC

  @ApiProperty({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  @IsNotEmpty()
  startDate: number

  @ApiProperty({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  @IsNotEmpty()
  endDate: number
}
