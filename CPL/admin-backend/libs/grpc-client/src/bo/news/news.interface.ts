import { Observable } from 'rxjs'
import { IGrpcResponse } from '../../grpc-client.interface'

export interface IGrpcNewsService {
  add(addRequest: IGrpcNewsAddRequest): Observable<IGrpcResponse>
  findOne(findOneRequest: IGrpcNewsFindOneRequest): Observable<IGrpcResponse>
  list(listRequest: IGrpcNewsListRequest): Observable<IGrpcResponse>
  update(updateRequest: IGrpcNewsUpdateRequest): Observable<IGrpcResponse>
  delete(deleteRequest: IGrpcNewsDeleteRequest): Observable<IGrpcResponse>
  export(listRequest: IGrpcNewsListRequest): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcNewsAddRequest {
  textEn: string
  textJp: string
  linkText: string
}

export interface IGrpcNewsUpdateRequest {
  id?: number
  textEn: string
  textJp: string
  linkText: string
}

export interface IGrpcNewsFindOneRequest {
  id?: number
  textEn: string
  textJp: string
  linkText: string
}

export interface IGrpcNewsListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  lang?: string
}

export interface IGrpcNewsDeleteRequest {
  id: number
}

export interface IGrpcNews {
  id: number
  textEn: string
  textJp: string
  linkText: string
}
