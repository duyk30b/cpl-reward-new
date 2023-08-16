import { Observable } from 'rxjs'
import { IGrpcResponse } from '..'

export interface IChannelService {
  add(addRequest: IAddRequest): Observable<IGrpcResponse>
  findOne(findOneRequest: IFindOneRequest): Observable<IGrpcResponse>
  list(listRequest: IListRequest): Observable<IGrpcResponse>
  update(updateRequest: IUpdateRequest): Observable<IGrpcResponse>
  delete(deleteRequest: IDeleteRequest): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IAddRequest {
  name: string
  link: string
  tagIds?: string
}

export interface IUpdateRequest {
  id?: number
  name?: string
  link?: string
  tagIds?: string
}

export interface IFindOneRequest {
  id?: number
  link?: string
}

export interface IListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IDeleteRequest {
  id: number
}

export interface ITag {
  id: number
  name: string
}
export interface IChannel {
  id: number
  name: string
  link: string
  dynamicLink: string
  tagIds: string
  tags?: ITag[]
}
