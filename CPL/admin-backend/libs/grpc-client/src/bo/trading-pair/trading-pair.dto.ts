import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import { IGrpcTradingPair } from './trading-pair.interface'

export class GrpcTradingPairDTO {
  @Expose()
  id: number

  @Expose({ name: 'symbol' })
  symbol: string

  @Expose({ name: 'active' })
  active: number

  @Expose({ name: 'binance_symbol' })
  binanceSymbol: string

  @Expose({ name: 'image' })
  image: string

  @Expose({ name: 'created_at' })
  createdAt: Date

  @Expose({ name: 'updated_at' })
  updatedAt: Date
}

export class BaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcTradingPairResponseDTO extends BaseResponseDTO {
  data?: IGrpcTradingPair
}

export class ListGrpcTradingPairResponseDTO extends BaseResponseDTO {
  data?: {
    data: IGrpcTradingPair[]
    meta: IPaginationMeta
  }
}
