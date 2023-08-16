import { Expose, Transform, Type } from 'class-transformer'
import { ResponsePaginationDto } from '../common/response-pagination.dto'
import { GRID_TYPE, SEARCH_BY_FIELD, SORT_TYPE, STRATEGY_STATUS } from './enum'

export class StrategyDto {
  @Expose({ name: 'id' })
  id: string

  @Expose({ name: 'owner_id' })
  ownerId: string

  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose({ name: 'lower_price' })
  lowerPrice: string

  @Expose({ name: 'higher_price' })
  higherPrice: string

  @Expose()
  status: STRATEGY_STATUS

  @Expose()
  email: string

  @Expose({ name: 'total_investment' })
  totalInvestment: string

  @Expose({ name: 'grid_number' })
  gridNumber: number

  @Expose({ name: 'create_time' })
  createTime: string
}

export class GetGridPaginationDto {
  @Expose({ name: 'coin' })
  @Type(() => String)
  @Transform(({ value }) => (value as string)?.toLowerCase() || undefined)
  coin?: string

  @Expose({ name: 'currency' })
  @Type(() => String)
  @Transform(({ value }) => (value as string)?.toLowerCase() || undefined)
  currency?: string

  @Expose({ name: 'status' })
  @Type(() => Number)
  status?: STRATEGY_STATUS

  @Expose()
  from?: string

  @Expose()
  to?: string

  @Expose()
  type?: GRID_TYPE

  @Expose({ name: 'search_by_field' })
  searchByField?: SEARCH_BY_FIELD

  @Expose()
  keyword?: string

  @Expose({ name: 'sort_by' })
  sortBy?: string

  @Expose()
  page: number

  @Expose({ name: 'per_page' })
  perPage: number

  @Expose({ name: 'sort_type' })
  sortType = SORT_TYPE.DESC
}

export class GetListGridResponseDto extends ResponsePaginationDto<
  StrategyDto[]
> {
  @Expose()
  @Type(() => StrategyDto)
  data: StrategyDto[] = []
}
