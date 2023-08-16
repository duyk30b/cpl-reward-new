import { SORT_TYPE } from '@/core/variables/common.enum'
import { Expose, Type } from 'class-transformer'

export class BasePaginationQueryDto {
  @Expose({ name: 'sort_type' })
  sortType?: SORT_TYPE

  @Expose({ name: 'per_page' })
  perPage?: number = 25

  @Expose({ name: 'page' })
  page?: number = 1
}

export class PaginationDto {
  @Expose()
  page: number

  @Expose()
  size: number

  @Expose()
  total: number
}

export abstract class ResponsePaginationDto<T = any> {
  abstract data: T

  @Expose()
  @Type(() => PaginationDto)
  pagination: PaginationDto
}
