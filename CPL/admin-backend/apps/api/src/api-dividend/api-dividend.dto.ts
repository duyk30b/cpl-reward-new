import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator'

enum DIVIDEND_CODE_STATUS {
  ENABLE = 1,
  DISABLE = 0,
}

export enum DIVIDEND_SPAN {
  ONCE = 'once',
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum DIVIDEND_CALCULATED_MODE {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  NON_CONDITION = 'non_condition',
}
export enum DISTRIBUTE_TYPE {
  INPUT_CODE = 'input_code',
  INDICATED_BALANCE = 'indicated_balance',
  NON_INDICATED_BALANCE = 'non_indicated_balance',
}

export interface DividendDate {
  date?: string
  month?: string
}

export interface ExecutingTime {
  HH?: string
  mm?: string
}

// base define
class BasePaginationQuery {
  @ApiProperty({ name: 'page', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsOptional()
  page?: number

  @ApiProperty({ name: 'limit', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsOptional()
  limit?: number
}

class BaseQuery {
  @ApiProperty({ name: 'locale', type: String, required: false })
  @Expose()
  @Type(() => String)
  @IsOptional()
  locale?: string
}

export class DividendAPIResponse {
  @ApiProperty({ name: 'success', type: Boolean, required: false })
  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  success: boolean

  @Expose()
  @IsOptional()
  data?: any
}

export class GetDividendsListRequest extends BasePaginationQuery {
  @Expose()
  @ApiProperty({ name: 'search_key', type: String, required: false })
  @IsString()
  @IsOptional()
  search_key: string

  @Expose()
  @ApiProperty({ name: 'target_currency', type: String, required: false })
  @IsString()
  @IsOptional()
  target_currency: string

  @Expose()
  @ApiProperty({ name: 'distributed_currency', type: String, required: false })
  @IsString()
  @IsOptional()
  distributed_currency: string

  @Expose()
  @ApiProperty({ name: 'dividend_status', type: String, required: false })
  @IsString()
  @IsOptional()
  dividend_status: string

  @Expose()
  @ApiProperty({ name: 'locale', type: String, required: false })
  @IsString()
  @IsOptional()
  locale?: string

  @Expose()
  @ApiProperty({ name: 'sort', type: String, required: false })
  @IsString()
  @IsOptional()
  sort?: string

  @Expose()
  @ApiProperty({ name: 'sort_type', type: String, required: false })
  @IsString()
  @IsOptional()
  sort_type?: string

  @Expose()
  @ApiProperty({ name: 'campaign_ids', type: String, required: false })
  @IsString()
  @IsOptional()
  campaign_ids: string
}

export class GetDividendCampaignNameRequest extends BaseQuery {
  @Expose()
  @ApiProperty({ name: 'excluded_ids', type: String, required: false })
  @IsString()
  @IsOptional()
  excluded_ids?: string

  @Expose()
  @ApiProperty({ name: 'excluded_statuses', type: String, required: false })
  @IsString()
  @IsOptional()
  excluded_statuses?: string

  @Expose()
  @ApiProperty({ name: 'sort', type: String, required: false })
  @IsString()
  @IsOptional()
  sort?: string

  @Expose()
  @ApiProperty({ name: 'sort_type', type: String, required: false })
  @IsString()
  @IsOptional()
  sort_type?: string
}

export class GetDividendCodesRequest extends BasePaginationQuery {
  @Expose()
  @ApiProperty({ name: 'search_key', type: String, required: false })
  @IsString()
  @IsOptional()
  search_key: string

  @ApiProperty({ name: 'dividend_id', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsOptional()
  dividend_id?: number

  @Expose()
  @ApiProperty({
    name: 'dividend_allocate_status',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  dividend_allocate_status: string

  @Expose()
  @ApiProperty({ name: 'dividend_status', type: String, required: false })
  @IsString()
  @IsOptional()
  dividend_status: string

  @Expose()
  @ApiProperty({ name: 'locale', type: String, required: false })
  @IsString()
  @IsOptional()
  locale?: string

  @Expose()
  @ApiProperty({ name: 'sort', type: String, required: false })
  @IsString()
  @IsOptional()
  sort?: string

  @Expose()
  @ApiProperty({ name: 'sort_type', type: String, required: false })
  @IsString()
  @IsOptional()
  sort_type?: string
}

export class ToggleDividendCodeDTO {
  @Expose()
  @ApiProperty({ name: 'code', type: String, required: true })
  @IsString()
  code: string

  @Expose()
  @ApiProperty({
    description: 'Enable -> 1, Disable -> 0',
    name: 'is_disable',
    enum: Object.values(DIVIDEND_CODE_STATUS).filter(
      (val) => typeof val === 'number',
    ),
    required: true,
  })
  @IsEnum(DIVIDEND_CODE_STATUS)
  is_disable: number
}

export class GetHistoriesRequest extends BasePaginationQuery {
  @Expose()
  @ApiProperty({ name: 'search_key', type: String, required: false })
  @IsOptional()
  @IsString()
  search_key: string

  @Expose()
  @ApiProperty({ name: 'selected_search', type: String, required: false })
  @IsOptional()
  @IsString()
  selected_search: string

  @ApiProperty({ name: 'dividend_id', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsOptional()
  dividend_id?: number

  @Expose()
  @Type(() => Number)
  @ApiProperty({ name: 'start_date', type: Number, required: false })
  @IsOptional()
  @IsNumber()
  start_date: number

  @Expose()
  @Type(() => Number)
  @ApiProperty({ name: 'end_date', type: Number, required: false })
  @IsOptional()
  @IsNumber()
  end_date: number

  @Expose()
  @ApiProperty({ name: 'sort', type: String, required: false })
  @IsOptional()
  @IsString()
  sort?: string

  @Expose()
  @ApiProperty({ name: 'sort_type', type: String, required: false })
  @IsOptional()
  @IsString()
  sort_type?: string
}

export class GetUsersDisableDividendRequest extends BasePaginationQuery {
  @Expose()
  @ApiProperty({ name: 'search_key', type: String, required: false })
  @IsOptional()
  @IsString()
  search_key: string

  @Expose()
  @ApiProperty({ name: 'sort', type: String, required: false })
  @IsOptional()
  @IsString()
  sort?: string

  @Expose()
  @ApiProperty({ name: 'sort_type', type: String, required: false })
  @IsOptional()
  @IsString()
  sort_type?: string
}

export class DividendCodeDTO {
  @Expose()
  @ApiProperty({ name: 'dividend_campaign_id', type: Number, required: true })
  @Type(() => Number)
  @IsNumber()
  dividend_campaign_id: number

  @Expose()
  @ApiProperty({ name: 'code', type: String, required: true })
  @Type(() => String)
  @IsString()
  code: string

  @Expose()
  @ApiProperty({ name: 'status', type: String, required: true })
  @Type(() => String)
  @IsString()
  status: string

  @Expose()
  @ApiProperty({ name: 'type', type: String, required: true })
  @Type(() => String)
  @IsString()
  type: string
}

export class CreateDividendCodeDTO {
  @ApiProperty({ type: [DividendCodeDTO] })
  @Type(() => DividendCodeDTO)
  @ValidateNested({ each: true })
  @IsArray()
  @Expose({ name: 'codes' })
  codes: DividendCodeDTO[]
}

export class CreateDividendDTO {
  @Expose()
  @ApiProperty({ name: 'dividend_name', type: String, required: true })
  @Type(() => String)
  @IsString()
  dividend_name: string

  @Expose()
  @ApiProperty({ name: 'target_currency', type: String, required: true })
  @Type(() => String)
  @IsString()
  target_currency: string

  @Expose()
  @ApiProperty({ name: 'distributed_currency', type: String, required: true })
  @Type(() => String)
  @IsString()
  distributed_currency: string

  @Expose()
  @ApiProperty({
    name: 'dividend_span',
    enum: Object.values(DIVIDEND_SPAN),
    required: true,
  })
  @Type(() => String)
  @IsEnum(DIVIDEND_SPAN)
  dividend_span: string

  @Expose()
  @ApiProperty({
    name: 'dividend_calculated_mode',
    enum: Object.values(DIVIDEND_CALCULATED_MODE),
    required: true,
  })
  @Type(() => String)
  @IsEnum(DIVIDEND_CALCULATED_MODE)
  dividend_calculated_mode: string

  @Expose()
  @ApiProperty({ name: 'dividend_rate', type: String, required: true })
  @Type(() => String)
  @IsString()
  dividend_rate: string

  @Expose()
  @ApiProperty({
    name: 'dividend_type',
    enum: Object.values(DISTRIBUTE_TYPE),
    required: true,
  })
  @Type(() => String)
  @IsEnum(DISTRIBUTE_TYPE)
  dividend_type: string

  @ApiProperty({ name: 'unlimited_end_date', type: Boolean, required: false })
  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  unlimited_end_date: boolean

  @ApiProperty({ name: 'gift', type: Boolean, required: false })
  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  gift: boolean

  @ApiProperty({ name: 'dividend_date', required: false })
  @Expose()
  @IsOptional()
  dividend_date: DividendDate

  @ApiProperty({ name: 'executing_time', required: false })
  @Expose()
  @IsOptional()
  executing_time: ExecutingTime

  @ApiProperty({ name: 'start_date', type: String, required: false })
  @Expose()
  @Type(() => String)
  @IsOptional()
  start_date: string

  @ApiProperty({ name: 'end_date', type: String, required: false })
  @Expose()
  @Type(() => String)
  @IsOptional()
  end_date: string

  @ApiProperty({ name: 'is_limited', type: Boolean, required: false })
  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_limited: boolean

  @ApiProperty({ name: 'dividend_limited', type: Boolean, required: false })
  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  dividend_limited: boolean

  @ApiProperty({ name: 'joined_user_maximum', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  joined_user_maximum: number

  @ApiProperty({ name: 'gift_amount', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  gift_amount: number

  @ApiProperty({ name: 'gift_currency', type: String, required: false })
  @Expose()
  @IsString()
  @IsOptional()
  gift_currency: string

  @ApiProperty({ name: 'indicated_amount', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  indicated_amount: number

  @ApiProperty({ name: 'dividend_maximum', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  dividend_maximum: number

  @ApiProperty({ name: 'HH', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  HH: number

  @ApiProperty({ name: 'mm', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  mm: number

  @ApiProperty({ name: 'offset', type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset: number
}

export class EditDividendDTO extends CreateDividendDTO {
  @Expose()
  @ApiProperty({ name: 'id', type: Number, required: true })
  @Type(() => Number)
  @IsNumber()
  id: number
}
export class ReviewCodeDTO {
  @Expose()
  @ApiProperty({ name: 'code', type: String, required: true })
  @Type(() => String)
  code: string

  @Expose()
  @ApiProperty({ name: 'user_id', type: Number, required: true })
  @Type(() => Number)
  @IsNumber()
  user_id: number
}
