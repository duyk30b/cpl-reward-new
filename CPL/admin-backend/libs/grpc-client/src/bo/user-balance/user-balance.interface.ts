import { Observable } from 'rxjs'
import { IGrpcResponse } from '../../grpc-client.interface'

export interface IGrpcUserBalanceService {
  list(listRequest: IGrpcUserBalanceListRequest): Observable<IGrpcResponse>
  export(listRequest: IGrpcUserBalanceListRequest): Observable<IGrpcResponse>
  summary({}): Observable<IGrpcResponse>
  listTransfers(
    listRequest: IGrpcUserBalanceListRequest,
  ): Observable<IGrpcResponse>
  exportListTransfers(
    listRequest: IGrpcUserBalanceListRequest,
  ): Observable<IGrpcResponse>
  listExport(
    listRequest: IGrpcUserBalanceListRequest,
  ): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcUserBalanceAddRequest {
  name: string
  link: string
  tagIds?: string
}

export interface IGrpcUserBalanceUpdateRequest {
  id?: number
  name?: string
  link?: string
  tagIds?: string
}

export interface IGrpcUserBalanceFindOneRequest {
  id?: number
  link?: string
}

export interface IGrpcUserBalanceListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  startDate?: string
  endDate?: string
  currency?: string
  from?: string
  status?: string
  lang?: string
}

export interface IGrpcUserBalanceDeleteRequest {
  id: number
}

export interface IGrpcUserBalance {
  id: number
  name: string
}
