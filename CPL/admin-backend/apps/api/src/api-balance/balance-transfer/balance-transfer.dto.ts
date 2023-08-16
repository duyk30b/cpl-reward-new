import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import {
  ArrayMaxSize,
  IsAlphanumeric,
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator'
import {
  ACCOUNT_LIST_MAX_ITEMS,
  BALANCE_TYPE,
  CURRENCY_MAX_LENGTH,
  VALIDATION_ERRORS,
  VALIDATION_LOCALE,
} from '../balance.enum'

export class TransferRequestDto {
  @Expose()
  @ApiProperty()
  @IsNumberString({}, { message: VALIDATION_ERRORS.IS_NUMBER_STRING })
  user_id: string

  @Expose()
  @ApiProperty({ enum: BALANCE_TYPE })
  @IsEnum(BALANCE_TYPE, { message: VALIDATION_ERRORS.BALANCE_TYPE_IS_INVALID })
  @Transform(({ value }) =>
    typeof BALANCE_TYPE[value] === 'number' ? BALANCE_TYPE[value] : +value,
  )
  balance_type_from: number

  @Expose()
  @ApiProperty({ enum: BALANCE_TYPE })
  @IsEnum(BALANCE_TYPE, { message: VALIDATION_ERRORS.BALANCE_TYPE_IS_INVALID })
  @Transform(({ value }) =>
    typeof BALANCE_TYPE[value] === 'number' ? BALANCE_TYPE[value] : +value,
  )
  balance_type_to: number

  @Expose()
  @ApiProperty()
  @IsAlphanumeric(VALIDATION_LOCALE, {
    message: VALIDATION_ERRORS.CURRENCY_IS_ALPHANUMERIC,
  })
  @MaxLength(CURRENCY_MAX_LENGTH, {
    message: VALIDATION_ERRORS.CURRENCY_MAX_LENGTH,
  })
  @Transform(({ value }) => value && value.toLowerCase())
  currency: string

  @Expose()
  @ApiProperty()
  @IsNumberString({}, { message: VALIDATION_ERRORS.IS_NUMBER_STRING })
  amount: string
}

export class ListBalanceTransferDto {
  @ApiProperty({
    required: false,
    description: '*Example:* usdt,btc',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? String(value)
          .split(',')
          .map((currency) => currency.trim().toLowerCase())
          .filter((currency) => currency)
      : [],
  )
  currencies: string[]

  @ApiProperty({
    required: false,
    type: [String],
    name: 'user_ids',
  })
  @Expose({ name: 'user_ids' })
  @ValidateIf((o) => o.userIds && o.userIds.length > 0)
  @Optional()
  @ArrayMaxSize(ACCOUNT_LIST_MAX_ITEMS)
  @IsNumberString(
    {},
    { each: true, message: VALIDATION_ERRORS.USER_ID_IS_NUMBER },
  )
  @IsArray()
  userIds: string[]

  @ApiProperty({
    enum: BALANCE_TYPE,
    required: false,
    name: 'balance_type_from',
  })
  @Optional()
  @Expose({ name: 'balance_type_from' })
  balanceTypeFrom: string

  @ApiProperty({
    required: false,
    name: 'start_date',
  })
  @Optional()
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({
    required: false,
    name: 'end_date',
  })
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
  @Optional()
  @Expose()
  sort: string

  @ApiProperty({
    required: false,
    enum: ['ASC', 'DESC'],
    name: 'sort_type',
  })
  @Optional()
  @Expose({
    name: 'sort_type',
  })
  @Transform(({ value }) => (value ? value.toUpperCase() : null))
  sortType?: 'ASC' | 'DESC'
}
