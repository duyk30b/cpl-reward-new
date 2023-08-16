import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcBlockUserService {
  add(addRequest: IGrpcBlockUserAddRequest): Observable<IGrpcResponse>
  findOne(
    findOneRequest: IGrpcBlockUserFindOneRequest,
  ): Observable<IGrpcResponse>
  list(listRequest: IGrpcBlockUserListRequest): Observable<IGrpcResponse>
  delete(deleteRequest: IGrpcBlockUserDeleteRequest): Observable<IGrpcResponse>
  export(listRequest: IGrpcBlockUserListRequest): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcBlockUserAddRequest {
  user_id: number
  reason: string
}

export interface IGrpcBlockUserUpdateRequest {
  id?: number
  user_id?: number
}

export interface IGrpcBlockUserFindOneRequest {
  id?: number
  user_id?: number
}

export interface IGrpcBlockUserListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  lang?: string
}

export interface IGrpcBlockUserDeleteRequest {
  id: number
}

export interface IGrpcBlockUser {
  id: number
  name: string
  userId: string
  email: string
}
