import { Observable } from 'rxjs'
import { IGrpcResponse } from '../../grpc-client.interface'

export interface IGrpcUserTradingService {
  list(listRequest: IGrpcUserTradingListRequest): Observable<IGrpcResponse>
  export(listRequest: IGrpcUserTradingListRequest): Observable<IGrpcResponse>
  statisticSummary(
    listRequest: IGrpcRequestStatisticSummary,
  ): Observable<IGrpcResponse>
  exportStatisticSummary(
    listRequest: IGrpcRequestStatisticSummary,
  ): Observable<IGrpcResponse>
  statisticDetail(
    listRequest: IGrpcRequestStatisticDetail,
  ): Observable<IGrpcResponse>
  exportStatisticDetail(
    listRequest: IGrpcRequestStatisticDetail,
  ): Observable<IGrpcResponse>
  statisticUser(
    listRequest: IGrpcRequestStatisticUser,
  ): Observable<IGrpcResponse>
  exportStatisticUser(
    listRequest: IGrpcRequestStatisticUser,
  ): Observable<IGrpcResponse>
  usersTradingLimit(
    listRequest: IGrpcUserTradingListRequest,
  ): Observable<IGrpcResponse>
  exportUsersTradingLimit(
    listRequest: IGrpcUserTradingListRequest,
  ): Observable<IGrpcResponse>
  suspensionUsers(
    listRequest: IGrpcUserTradingListRequest,
  ): Observable<IGrpcResponse>
  suspensionModes(
    listRequest: IFilterSuspensionModesRequest,
  ): Observable<IGrpcResponse>
  suspensionPairs(
    listRequest: IGrpcUserTradingListRequest,
  ): Observable<IGrpcResponse>
  exportSuspensionCommon(
    listRequest: IGrpcUserTradingListRequest,
  ): Observable<IGrpcResponse>
  exportSuspensionTradeMode(
    listRequest: IGrpcUserTradingListRequest,
  ): Observable<IGrpcResponse>
  exportSuspensionMarket(
    listRequest: IGrpcUserTradingListRequest,
  ): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcUserTradingAddRequest {
  name: string
  link: string
  tagIds?: string
}

export interface IGrpcUserTradingUpdateRequest {
  id?: number
  name?: string
  link?: string
  tagIds?: string
}

export interface IGrpcUserTradingFindOneRequest {
  id?: number
  link?: string
}

export interface IGrpcUserTradingListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  status?: string
  winLose?: string
  mode?: string
  pair?: string
  period?: string
  startDate?: string
  endDate?: string
  lang?: string
}

export interface IFilterHistoryOrderRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  status?: string
  winLose?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  mode?: string
  period?: string
  pair?: string
}

export interface IFilterSuspensionModesRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  mode?: string
  pair?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IGrpcUserTradingDeleteRequest {
  id: number
}

export interface IGrpcUserTrading {
  id: number
  name: string
}

export interface IGrpcRequestStatisticSummary {
  startDate?: string
  endDate?: string
  lang?: string
}

export interface IGrpcRequestStatisticDetail {
  startDate?: string
  endDate?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  lang?: string
}

export interface IGrpcRequestStatisticUser {
  startDate?: string
  endDate?: string
  userId?: number
  lang?: string
}
