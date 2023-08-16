import { Observable } from 'rxjs'
import { IGrpcResponse } from '../../grpc-client.interface'

export interface IGrpcPairPriceService {
  add(addRequest: IGrpcPairPriceAddRequest): Observable<IGrpcResponse>
  findOne(
    findOneRequest: IGrpcPairPriceFindOneRequest,
  ): Observable<IGrpcResponse>
  list(listRequest: IGrpcPairPriceListRequest): Observable<IGrpcResponse>
  update(updateRequest: IGrpcPairPriceUpdateRequest): Observable<IGrpcResponse>
  delete(deleteRequest: IGrpcPairPriceDeleteRequest): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcPairPriceAddRequest {
  symbol: string
  price: number
  priceTime: Date
}

export interface IGrpcPairPriceUpdateRequest {
  id?: number
  symbol: string
  price: number
  priceTime: Date
}

export interface IGrpcPairPriceFindOneRequest {
  id?: number
  symbol: string
  price: number
  priceTime: Date
}

export interface IGrpcPairPriceListRequest {
  page?: number
  limit?: number
  targetDate?: string
  source?: string
  globalTrend?: string
  forcedFlag?: string
  pair?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  searchField?: string
  searchText?: string
}

export interface IGrpcPairPriceDeleteRequest {
  id: number
}

export interface IGrpcPairPrice {
  id: number
  name: string
}
