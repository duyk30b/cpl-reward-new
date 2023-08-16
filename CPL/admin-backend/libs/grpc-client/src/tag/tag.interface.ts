import { Observable } from 'rxjs'
import { IGrpcResponse } from '..'

export interface ITagService {
  add(addRequest: IAddRequest): Observable<IGrpcResponse>
  addOne(addOneRequest: IAddOneRequest): Observable<IGrpcResponse>
  findByIds(findByIdsRequest: IFindByIdsRequest): Observable<IGrpcResponse>
  search(searchRequest: ISearchRequest): Observable<IGrpcResponse>
  update(updateRequest: IUpdateRequest): Observable<IGrpcResponse>
  deleteOne(deleteOneRequest: IDeleteOneRequest): Observable<IGrpcResponse>
  deleteMany(deleteManyRequest: IDeleteManyRequest): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IAddRequest {
  names: string[]
}

export interface IAddOneRequest {
  name: string
}

export interface IUpdateRequest {
  id?: number
  name: string
}

export interface IFindByIdsRequest {
  ids: number[]
}

export interface ISearchRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IDeleteManyRequest {
  ids: number[]
}

export interface IDeleteOneRequest {
  id: number
}

export interface ITag {
  id: number
  name: string
  isExisted: boolean
  createdAt: string
  updatedAt: string
}
