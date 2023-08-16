import { Observable } from 'rxjs'
import { IGrpcResponse } from '..'

export interface IUserTagService {
  addUserTags(addRequest: IAddRequest): Observable<IGrpcResponse>
  findUserTagsByUserId(
    findByUserIdRequest: IFindByUserIdRequest,
  ): Observable<IGrpcResponse>
  findById(findByIdRequest: IFindByIdRequest): Observable<IGrpcResponse>
  listUserTags(listRequest: IListRequest): Observable<IGrpcResponse>
  deleteUserTag(deleteRequest: IDeleteRequest): Observable<IGrpcResponse>
  deleteUserTags(
    deleteUserTagsRequest: IDeleteUserTagsRequest,
  ): Observable<IGrpcResponse>
  deleteUserTagsByUsers(
    deleteUserTagsByUsersRequest: IDeleteUserTagsByUsersRequest,
  ): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface AddUserTag {
  userId: number
  tagIds: number[]
}

export interface IAddRequest {
  userTags: AddUserTag[]
}

export interface IFindByUserIdRequest {
  userId: number
}

export interface IFindByIdRequest {
  id: number
}

export interface IListRequest {
  page?: number
  limit?: number
  userIds?: number[]
}

export interface IDeleteUserTagsRequest {
  ids: number[]
}

export interface IDeleteUserTagsByUsersRequest {
  userIds: number[]
}

export interface IDeleteRequest {
  id: number
}

export interface IUserTag {
  id: number
  name: string
}
