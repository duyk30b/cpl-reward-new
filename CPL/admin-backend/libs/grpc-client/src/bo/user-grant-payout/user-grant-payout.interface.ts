import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcUserGrantPayoutService {
  add(addRequest: IGrpcUserGrantPayoutAddRequest): Observable<IGrpcResponse>
  update(
    updateRequest: IGrpcUserGrantPayoutUpdateRequest,
  ): Observable<IGrpcResponse>
  findOne(
    findOneRequest: IGrpcUserGrantPayoutFindOneRequest,
  ): Observable<IGrpcResponse>
  list(listRequest: IGrpcUserGrantPayoutListRequest): Observable<IGrpcResponse>
  delete(
    deleteRequest: IGrpcUserGrantPayoutDeleteRequest,
  ): Observable<IGrpcResponse>
  export(
    listRequest: IGrpcUserGrantPayoutListRequest,
  ): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcUserGrantPayoutAddRequest {
  user_id: number
  payout_bonus: number
  note: string
  status: number
}

export interface IGrpcUserGrantPayoutUpdateRequest {
  id: number
  payout_bonus: number
  note: string
  status: number
}

export interface IGrpcUserGrantPayoutFindOneRequest {
  id?: number
  user_id?: number
}

export interface IGrpcUserGrantPayoutListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  lang?: string
}

export interface IGrpcUserGrantPayoutDeleteRequest {
  id: number
}

export interface IGrpcUserGrantPayout {
  id: number
  userId: string
  email: string
  payoutBonus: number
}
