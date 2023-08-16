import { Expose, Type } from 'class-transformer'
import { DividendDate } from '@/views/dividend/definition/dividend.interface'

export class BasePaginationQuery {
  @Expose()
  page?: number

  @Expose()
  limit?: number
}

export class BaseQuery {
  @Expose()
  locale?: string
}

export class DividendAPIResponse {
  @Type(() => Boolean)
  @Expose()
  success: boolean

  @Expose()
  data?: any
}

export class GetDividendListRequest extends BasePaginationQuery {
  @Expose()
  search_key: string

  @Expose()
  target_currency: string

  @Expose()
  distributed_currency: string

  @Expose()
  dividend_status: string

  @Expose()
  campaign_ids?: string | string[]

  @Expose()
  sort: string

  @Expose()
  sort_type: string

  @Expose()
  locale?: string
}

export class GetDividendDetailRequest {
  @Expose()
  id: number
}

export class GetDividendAdvancedRequest {
  @Expose()
  id: number

  @Expose()
  target_currency: string

  @Expose()
  distributed_currency: string

  @Expose()
  dividend_rate: string

  @Expose()
  dividend_calculated_mode: string
}

export class GetDividendNamesRequest extends BaseQuery {
  @Expose()
  excluded_ids: string

  @Expose()
  excluded_statuses: string

  @Expose()
  sort: string

  @Expose()
  sort_type: string
}

export class GetDividendCodesRequest extends BasePaginationQuery {
  @Expose()
  search_key: string

  @Expose()
  dividend_name: string

  @Expose()
  dividend_allocate_status: string

  @Expose()
  dividend_status: string

  @Expose()
  locale?: string
}

export class GetDividendCampaignsRequest extends BaseQuery {}

export class CreateDividendDto {
  @Expose()
  dividend_name: string

  @Expose()
  target_currency: string

  @Expose()
  distributed_currency: string

  @Expose()
  dividend_span: string

  @Expose()
  dividend_calculated_mode: string

  @Expose()
  dividend_type: string

  @Expose()
  dividend_date: DividendDate

  @Expose()
  joined_user_maximum: number

  @Expose()
  gift: boolean

  @Expose()
  unlimited_end_date: boolean

  @Expose()
  gift_amount: number

  @Expose()
  dividend_maximum: number

  @Expose()
  dividend_rate: number

  @Expose()
  indicated_amount: number

  @Expose()
  start_date: string

  @Expose()
  end_date: string
}

export class GetDividendHistoriesRequest extends BasePaginationQuery {
  @Expose()
  start_date: number

  @Expose()
  end_date: number

  @Expose()
  selected_search: string

  @Expose()
  search_key: string

  @Expose()
  dividend_name: string
}

export class ReviewCodeRequest {
  @Expose()
  code: string

  @Expose()
  user_id: number
}
