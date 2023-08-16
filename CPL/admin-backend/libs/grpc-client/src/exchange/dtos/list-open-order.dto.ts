import { PaginationDto } from '@app/common/base-pagination.dto'
import { Exclude, Expose } from 'class-transformer'
import { BaseOrderDto } from './base-order.dto'

@Exclude()
export class ListOpenOrderRequest {
  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  take?: number

  @Expose()
  from?: string

  @Expose()
  to?: string

  @Expose()
  userId: string

  @Expose()
  status: number
}

@Exclude()
export class ListOpenOrderResponse {
  @Expose()
  data: BaseOrderDto[]

  @Expose()
  pagination: PaginationDto
}
