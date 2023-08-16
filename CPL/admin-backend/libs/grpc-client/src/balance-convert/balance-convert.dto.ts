import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsIn,
  IsString,
  IsNumberString,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { VALIDATION_ERRORS } from 'apps/api/src/api-balance/balance.enum'
import {
  BALANCE_SORT_FIELD_MAP,
  BALANCE_SEARCH_FIELD_MAP,
  BALANCE_SEARCH_EQUAL_FIELD_MAP,
  BALANCE_CONVERT_LOG_SEARCH_FIELD_MAP,
  BALANCE_CONVERT_LOG_SEARCH_EQUAL_FIELD_MAP,
  BALANCE_CONVERT_LOG_SORT_FIELD_MAP,
  BALANCE_STATUS,
} from './balance-convert.constant'
import { RequiredIf } from '@app/common/validation/decorators/required-if'
import { Optional } from '@nestjs/common'

export const VALIDATION_REQUIRED = (field: string) => {
  return `${field}_IS_REQUIRED`
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

export class BalanceConvert {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'module' })
  @Expose({ name: 'module', toPlainOnly: true })
  module: string

  @ApiProperty({ name: 'value' })
  @Expose({ name: 'value', toPlainOnly: true })
  value: string

  @ApiProperty({ name: 'status' })
  @Expose({ name: 'status', toPlainOnly: true })
  status: number

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}

export class BalanceConvertLog extends BalanceConvert {
  @ApiProperty({ name: 'balance_convert_id' })
  @Expose({ name: 'balance_convert_id', toPlainOnly: true })
  balanceConvertId: string
}

export class BalanceConvertListResultDto {
  @ApiProperty({ name: 'data', type: [BalanceConvert] })
  @Type(() => BalanceConvert)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: BalanceConvert[] = []

  @ApiProperty({ type: PaginationDto })
  @Expose()
  pagination: PaginationDto
}

export class BalanceConvertListLogResultDto {
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: BalanceConvertLog[]

  @ApiProperty({ type: PaginationDto })
  @Expose()
  pagination: PaginationDto
}

export class GetBalanceConvertRequest {
  @ApiProperty()
  @Expose()
  @IsNumberString({ message: VALIDATION_ERRORS.ID_IS_NUMBER })
  id: string
}

export class ListBalanceConvertRequest {
  @ApiProperty({ name: 'search_field', required: false })
  @ValidateIf((o) => o.searchField)
  @Expose({ name: 'search_field' })
  @IsIn(
    Object.keys({
      ...BALANCE_SEARCH_FIELD_MAP,
      ...BALANCE_SEARCH_EQUAL_FIELD_MAP,
    }),
    {
      message: `${VALIDATION_ERRORS.SEARCH_FIELD_ONLY_SUPPORT}_(${Object.keys({
        ...BALANCE_SEARCH_FIELD_MAP,
        ...BALANCE_SEARCH_EQUAL_FIELD_MAP,
      })})`,
    },
  )
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({
    required: false,
  })
  @Expose()
  @ValidateIf((o) => o.sort)
  @IsIn(Object.keys(BALANCE_SORT_FIELD_MAP), {
    message: `${VALIDATION_ERRORS.SORT_FIELD_ONLY_SUPPORT}_(${Object.keys(
      BALANCE_SORT_FIELD_MAP,
    )})`,
  })
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
}

export class ListBalanceConvertLogRequest extends ListBalanceConvertRequest {
  @ApiProperty({ required: false, name: 'search_field' })
  @ValidateIf((o) => o.searchField)
  @Expose({ name: 'search_filed' })
  @IsIn(
    Object.keys({
      ...BALANCE_CONVERT_LOG_SEARCH_FIELD_MAP,
      ...BALANCE_CONVERT_LOG_SEARCH_EQUAL_FIELD_MAP,
    }),
    {
      message: `${VALIDATION_ERRORS.SEARCH_FIELD_ONLY_SUPPORT}_(${Object.keys({
        ...BALANCE_CONVERT_LOG_SEARCH_FIELD_MAP,
        ...BALANCE_CONVERT_LOG_SEARCH_EQUAL_FIELD_MAP,
      })})`,
    },
  )
  searchField: string

  @ApiProperty({ required: false, name: 'search_text' })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({
    required: false,
  })
  @Expose()
  @ValidateIf((o) => o.sort)
  @IsIn(Object.keys(BALANCE_CONVERT_LOG_SORT_FIELD_MAP), {
    message: `${VALIDATION_ERRORS.SORT_FIELD_ONLY_SUPPORT}_(${Object.keys(
      BALANCE_CONVERT_LOG_SORT_FIELD_MAP,
    )})`,
  })
  sort: string
}

export class CreateBalanceConvertRequest {
  @ApiProperty()
  @Expose()
  @IsString()
  @Transform(({ value }) => value && value.toLowerCase())
  module: string

  @ApiProperty()
  @Expose()
  @IsString()
  @Transform(({ value }) => value && value.toLowerCase())
  code: string

  @ApiProperty()
  @Expose()
  @IsString()
  @Transform(({ value }) => value && value.toLowerCase())
  value: string

  @ApiProperty({ enum: BALANCE_STATUS })
  @Expose()
  @RequiredIf((object) => !object.status, {
    message: VALIDATION_REQUIRED('STATUS'),
  })
  @Transform(({ value }) =>
    typeof BALANCE_STATUS[value] === 'number' ? BALANCE_STATUS[value] : +value,
  )
  status: number
}

export class UpdateBalanceConvertRequest {
  @ApiProperty()
  @Expose()
  @IsNumberString({ message: VALIDATION_ERRORS.ID_IS_NUMBER })
  id: string

  @ApiProperty()
  @Expose()
  @IsString()
  @Transform(({ value }) => value && value.toLowerCase())
  module: string

  @ApiProperty()
  @Expose()
  @IsString()
  @Transform(({ value }) => value && value.toLowerCase())
  code: string

  @ApiProperty()
  @Expose()
  @IsString()
  @Transform(({ value }) => value && value.toLowerCase())
  value: string

  @ApiProperty({ enum: BALANCE_STATUS })
  @Expose()
  @RequiredIf((object) => !object.status, {
    message: VALIDATION_REQUIRED('ACTIVE'),
  })
  @Transform(({ value }) =>
    typeof BALANCE_STATUS[value] === 'number' ? BALANCE_STATUS[value] : +value,
  )
  status: number
}

export class DeleteBalanceConvertRequest {
  @ApiProperty()
  @Expose()
  @IsNumberString(
    { no_symbols: true },
    { message: VALIDATION_ERRORS.ID_IS_NUMBER },
  )
  id: string
}
