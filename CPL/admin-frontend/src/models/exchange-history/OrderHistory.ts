import { CANCEL_RESOURCE } from '@/core/variables/common.const'
import { Exclude, Expose, Type } from 'class-transformer'
import { PaginationDto } from '../common/response-pagination.dto'
import { OpenOrderItem, OpenOrderParams } from './OpenOrder'

@Exclude()
export class OrderHistoryParams extends OpenOrderParams {
  @Expose({ name: 'status' })
  status?: string

  @Expose()
  resources?: string
}

@Exclude()
export class FeeOrderItem {
  @Expose()
  value: string

  @Expose()
  currency: string
}

@Exclude()
export class CancelledDto {
  @Expose()
  resource: CANCEL_RESOURCE

  @Expose()
  id: string
}

@Exclude()
export class OrderHistoryItem extends OpenOrderItem {
  @Expose()
  fee: FeeOrderItem[]

  @Expose()
  filled_price: string

  @Expose()
  stop_price: string

  @Expose()
  filled_volume: string

  @Expose()
  stop_direction: number

  @Expose()
  @Type(() => CancelledDto)
  cancelled: CancelledDto
}

export class GetListOpenHistoryResponse {
  @Expose()
  data: OrderHistoryItem[]

  @Expose()
  pagination: PaginationDto
}
