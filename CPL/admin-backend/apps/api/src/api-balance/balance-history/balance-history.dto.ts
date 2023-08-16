import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'
import {
  BALANCE_TYPE,
  TRANSACTION_TYPE,
  VALIDATION_ERRORS,
} from '../balance.enum'

export class ListBalanceHistoryRequestDto {
  @ApiProperty({ required: false })
  @Optional()
  @Expose()
  @Transform(({ value }) => value && value.toLowerCase())
  currency: string

  @ApiProperty({ name: 'user_id' })
  @IsNotEmpty()
  @IsNumber({}, { message: VALIDATION_ERRORS.USER_ID_IS_NUMBER })
  @Type(() => Number)
  @Expose({ name: 'user_id' })
  userId: string

  @ApiProperty({ enum: TRANSACTION_TYPE, required: false })
  @Optional()
  @Expose({ name: 'transaction_type' })
  @Transform(({ value }) =>
    typeof TRANSACTION_TYPE[value] === 'number'
      ? TRANSACTION_TYPE[value]
      : +value,
  )
  transactionType: number

  @ApiProperty({ enum: BALANCE_TYPE, required: false })
  @Optional()
  @Expose({ name: 'balance_type' })
  @Transform(({ value }) =>
    typeof BALANCE_TYPE[value] === 'number' ? BALANCE_TYPE[value] : +value,
  )
  balanceType: number

  @ApiProperty({ required: false, name: 'search_field' })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ required: false, name: 'search_text' })
  @Expose({ name: 'search_text' })
  searchText: string

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
  @Optional()
  @Expose()
  sort: string

  @ApiProperty({
    required: false,
    enum: ['ASC', 'DESC'],
    name: 'sort_type',
  })
  @Optional()
  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => (value ? value.toUpperCase() : null))
  sortType?: 'ASC' | 'DESC'

  @ApiProperty({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  @IsNotEmpty()
  startDate: string

  @ApiProperty({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  @IsNotEmpty()
  endDate: string
}
