import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import { IGrpcPairPrice } from './pair-price.interface'

export class GrpcPairPriceDTO {
  @Expose()
  id: number

  @Expose({ name: 'symbol' })
  symbol: string

  @Expose({ name: 'price' })
  price: number

  @Expose({ name: 'price_time' })
  priceTime: Date

  @Expose()
  source: string

  @Expose({ name: 'data_raw' })
  dataRaw: string

  @Expose({ name: 'created_at' })
  createdAt: Date

  @Expose({ name: 'updated_at' })
  updatedAt: Date

  @Expose({ name: 'force_flag' })
  forceFlag: string

  @Expose()
  timestamp: number

  @Expose({ name: 'adjustment_rate' })
  adjustmentRate: number

  @Expose({ name: 'buffer_rate' })
  bufferRate: number

  @Expose({ name: 'selected_exchange' })
  selectedExchange: string

  @Expose({ name: 'global_trend' })
  globalTrend: string

  @Expose({ name: 'prices' })
  prices: any
}

export class BaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcPairPriceResponseDTO extends BaseResponseDTO {
  data?: IGrpcPairPrice
}

export class ListGrpcPairPriceResponseDTO extends BaseResponseDTO {
  data?: {
    items: IGrpcPairPrice[]
    meta: IPaginationMeta
  }
}
