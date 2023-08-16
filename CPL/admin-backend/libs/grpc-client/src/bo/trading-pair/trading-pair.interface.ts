import { Observable } from 'rxjs'
import { IGrpcResponse } from '../../grpc-client.interface'

export interface IGrpcTradingPairService {
  add(addRequest: IGrpcTradingPairAddRequest): Observable<IGrpcResponse>
  findOne(
    findOneRequest: IGrpcTradingPairFindOneRequest,
  ): Observable<IGrpcResponse>
  list(listRequest: IGrpcTradingPairListRequest): Observable<IGrpcResponse>
  update(
    updateRequest: IGrpcTradingPairUpdateRequest,
  ): Observable<IGrpcResponse>
  delete(
    deleteRequest: IGrpcTradingPairDeleteRequest,
  ): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcTradingPairAddRequest {
  symbol: string
  active: number
  binance_symbol: string
  image: string
}

export interface IGrpcTradingPairUpdateRequest {
  id?: number
  symbol: string
  active: number
  binance_symbol: string
  image: string
}

export interface IGrpcTradingPairFindOneRequest {
  id?: number
  symbol: string
  active: number
  binance_symbol: string
  image: string
}

export interface IGrpcTradingPairListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  getOnly?: 'true' | 'fasle'
}

export interface IGrpcTradingPairDeleteRequest {
  id: number
}

export interface IGrpcTradingPair {
  id: number
  symbol: string
  active: number
  binance_symbol: string
  image: string
}
