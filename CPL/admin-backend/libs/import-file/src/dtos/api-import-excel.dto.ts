import { FixedNumberIsNotZero } from '@app/common/validation/decorators/fixed-number-is-not-zero'
import { IsFixedNumberString } from '@app/common/validation/decorators/is-fixed-number-string'
import { ApiProperty } from '@nestjs/swagger'
import { VALIDATION_ERRORS } from 'apps/api/src/api-balance/balance.enum'
import { Expose } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator'
import { BasePaginationQuery } from './base.dto'

export class BalanceFileInfoDto {
  @Expose()
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    {
      message: VALIDATION_ERRORS.ID_IS_NUMBER,
    },
  )
  @IsNotEmpty({
    message: VALIDATION_ERRORS.ID_IS_NOT_EMPTY,
  })
  id: number

  @Expose()
  @IsEmail(
    {},
    {
      message: VALIDATION_ERRORS.INVALID_EMAIL_ADDRESS,
    },
  )
  @IsNotEmpty({
    message: VALIDATION_ERRORS.EMAIL_IS_NOT_EMPTY,
  })
  email: string

  @Expose()
  @IsNotEmpty({
    message: VALIDATION_ERRORS.CURRENCY_IS_NOT_EMPTY,
  })
  currency: string

  @Expose()
  @FixedNumberIsNotZero({
    message: VALIDATION_ERRORS.AMOUNT_FIXED_NUMBER_IS_NOT_ZERO,
  })
  @IsFixedNumberString({
    message: VALIDATION_ERRORS.AMOUNT_IS_DECIMAL,
  })
  amount: string

  @Expose()
  @IsOptional()
  status: string

  @Expose()
  @IsOptional()
  note: string
}

export class ListBalanceFilesRequest extends BasePaginationQuery {}

export class DetailBalanceFilesRequest extends BasePaginationQuery {
  fileId: string
}

export class BalanceFileSettingRequest extends BasePaginationQuery {
  @IsOptional()
  @Expose()
  currency?: string
}

export class BalanceFileSettingCreateRequest {
  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    example: 'eth, btc, bch, jpi...',
    description: 'Name of blockchain symbol',
  })
  currency: string

  @Expose({ name: 'max_file_amount' })
  @IsNotEmpty()
  @IsNumberString({}, { message: 'IS_NUMBER' })
  @ApiProperty({
    name: 'max_file_amount',
    example: '1123',
    description: 'Maximum number of a currency in file',
  })
  maxFileAmount: string

  @Expose({ name: 'max_line_amount' })
  @IsNotEmpty()
  @IsNumberString({}, { message: 'IS_NUMBER' })
  @ApiProperty({
    name: 'max_line_amount',
    example: '1123',
    description: 'Maximum number of a currency in line',
  })
  maxLineAmount: string

  @Expose({ name: 'remain_amount' })
  @IsNotEmpty()
  @IsNumberString({}, { message: 'IS_NUMBER' })
  @ApiProperty({
    name: 'remain_amount',
    example: '1123',
    description: 'Remaining importable amount of a currency',
  })
  remainAmount: string

  @Expose({ name: 'is_unlimited' })
  @ApiProperty({
    required: false,
    name: 'is_unlimited',
    example: true,
    description: 'Currency is unlimited amount or not?',
  })
  isUnlimited: boolean
}

export interface BalanceSummaryResponse {
  total_rows: number
  failed_rows: number
  succeed_rows: number
}
