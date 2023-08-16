import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  MaxLength,
} from 'class-validator'
import {
  BALANCE_TYPE,
  CURRENCY_MAX_LENGTH,
  VALIDATION_ERRORS,
  VALIDATION_LOCALE,
} from '../balance.enum'

export class CorrectRequest {
  @Expose()
  @ApiProperty()
  @IsNumberString({}, { message: VALIDATION_ERRORS.IS_NUMBER_STRING })
  user_id: string

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
  @ApiProperty({ enum: BALANCE_TYPE })
  @IsEnum(BALANCE_TYPE, { message: VALIDATION_ERRORS.BALANCE_TYPE_IS_INVALID })
  @Transform(({ value }) =>
    typeof BALANCE_TYPE[value] === 'number' ? BALANCE_TYPE[value] : +value,
  )
  balance_type: number

  @Expose()
  @ApiProperty()
  @IsNumberString({}, { message: VALIDATION_ERRORS.IS_NUMBER_STRING })
  diff_actual_balance: string

  @Expose()
  @ApiProperty()
  @IsNumberString({}, { message: VALIDATION_ERRORS.IS_NUMBER_STRING })
  diff_available_balance: string

  @ApiProperty()
  @Expose()
  @IsNumberString({}, { message: VALIDATION_ERRORS.USER_ID_IS_NUMBER })
  corrected_by: string

  @ApiProperty()
  @Expose()
  reason: string

  @ApiProperty()
  @Expose()
  @IsNumber()
  @Type(() => Number)
  is_update_balance: number
}

export class GetDiffBalanceRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString({}, { message: VALIDATION_ERRORS.USER_ID_IS_NUMBER })
  @Expose()
  user_id: string

  @ApiProperty()
  @Optional()
  @Expose()
  @Transform(({ value }) => value && value.toLowerCase())
  currency: string

  @Expose()
  @ApiProperty({ enum: BALANCE_TYPE })
  @IsEnum(BALANCE_TYPE, { message: VALIDATION_ERRORS.BALANCE_TYPE_IS_INVALID })
  @Transform(({ value }) =>
    typeof BALANCE_TYPE[value] === 'number' ? BALANCE_TYPE[value] : +value,
  )
  balance_type: number
}

export class CheckBalanceInvalidRequest {
  @ApiProperty()
  @Expose()
  @IsNumberString({}, { message: VALIDATION_ERRORS.USER_ID_IS_NUMBER })
  user_id: string

  @ApiProperty()
  @Optional()
  @Expose()
  @Transform(({ value }) => value && value.toLowerCase())
  currency: string

  @Expose()
  @ApiProperty({ enum: BALANCE_TYPE })
  @IsEnum(BALANCE_TYPE, { message: VALIDATION_ERRORS.BALANCE_TYPE_IS_INVALID })
  @Transform(({ value }) =>
    typeof BALANCE_TYPE[value] === 'number' ? BALANCE_TYPE[value] : +value,
  )
  balance_type: number
}

export class GetAbnormalBalanceUsersRequest {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ required: false, example: 20 })
  @Expose()
  size: number

  @ApiProperty({ required: false, example: 20 })
  @Expose()
  userIds: string[]
}

export class GetAbnormalBalanceAccountsRequest {
  @ApiProperty({
    example: '1234',
  })
  @Expose()
  userId: string
}

export class GetAbnormalBalanceHistoriesRequest {
  @ApiProperty({
    required: false,
    example: '1234',
    name: 'user_id',
  })
  @Expose({ name: 'user_id' })
  userId: string

  @ApiProperty({
    required: false,
    example: 'usdt',
  })
  @Expose()
  @Optional()
  currency: string

  @ApiProperty({
    required: false,
    example: 'EXCHANGE',
    name: 'balance_type',
  })
  @Expose({ name: 'balance_type' })
  @Optional()
  balanceType: string

  @ApiProperty({
    required: false,
    example: 'TRADING',
    name: 'transaction_type',
  })
  @Expose({ name: 'transaction_type' })
  @Optional()
  transactionType: string

  @ApiProperty({
    required: false,
    example: 'CORRECTED',
  })
  @Expose()
  @Optional()
  status: string

  @ApiProperty({ required: false, example: 1 })
  @Expose()
  @Optional()
  page: number

  @ApiProperty({ required: false, example: 20 })
  @Expose()
  @Optional()
  size: number

  @ApiProperty({ required: false })
  @Expose()
  @Optional()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  @Optional()
  sortType: 'ASC' | 'DESC'

  @ApiProperty({ name: 'start_date' })
  @Expose({ name: 'start_date' })
  @IsNotEmpty()
  startDate: string

  @ApiProperty({ name: 'end_date' })
  @Expose({ name: 'end_date' })
  @IsNotEmpty()
  endDate: string
}
