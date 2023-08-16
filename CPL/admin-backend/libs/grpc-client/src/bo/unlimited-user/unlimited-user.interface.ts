import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcUnlimitedUserService {
  add(addRequest: IGrpcUnlimitedUserAddRequest): Observable<IGrpcResponse>
  findOne(
    findOneRequest: IGrpcUnlimitedUserFindOneRequest,
  ): Observable<IGrpcResponse>
  list(listRequest: IGrpcUnlimitedUserListRequest): Observable<IGrpcResponse>
  findAllVerified(
    listRequest: IGrpcUnlimitedUserListRequest,
  ): Observable<IGrpcResponse>
  update(
    updateRequest: IGrpcUnlimitedUserUpdateRequest,
  ): Observable<IGrpcResponse>
  delete(
    deleteRequest: IGrpcUnlimitedUserDeleteRequest,
  ): Observable<IGrpcResponse>
  export(listRequest: IGrpcUnlimitedUserListRequest): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcUnlimitedUserAddRequest {
  user_id: number
}

export interface IGrpcUnlimitedUserUpdateRequest {
  id?: number
  user_id?: number
}

export interface IGrpcUnlimitedUserFindOneRequest {
  id?: number
  user_id?: number
}

export interface IGrpcUnlimitedUserListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  lang?: string
}

export interface IGrpcUnlimitedUserDeleteRequest {
  id: number
}

export interface IGrpcUnlimitedUser {
  id: number
  name: string
  userId: string
  email: string
  lastLogin: string
}
