import { Observable } from 'rxjs'
import { IGrpcResponse } from '../../grpc-client.interface'

export interface IGrpcWinningRateService {
  listSeconds(
    listRequest: IGrpcWinningRateListRequest,
  ): Observable<IGrpcResponse>

  listMinutes(
    listRequest: IGrpcWinningRateListRequest,
  ): Observable<IGrpcResponse>

  listHours(listRequest: IGrpcWinningRateListRequest): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcWinningRateAddRequest {
  name: string
  link: string
  tagIds?: string
}

export interface IGrpcWinningRateUpdateRequest {
  id?: number
  name?: string
  link?: string
  tagIds?: string
}

export interface IGrpcWinningRateFindOneRequest {
  id?: number
  link?: string
}

export interface IGrpcWinningRateListRequest {
  page?: number
  limit?: number
  pair?: string
  mode?: string
  period?: string
}

export interface IGrpcWinningRateDeleteRequest {
  id: number
}

export interface IGrpcWinningRate {
  id: number
  name: string
}
