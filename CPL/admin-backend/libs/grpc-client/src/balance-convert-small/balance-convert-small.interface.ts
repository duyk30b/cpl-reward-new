import { Observable } from 'rxjs'
import { IResponseWithPagination } from '../grpc-client.interface'
import {
  ListBalanceConvertSmallRequest,
  BalanceConvertSmall,
  BalanceConvertSmallDetail,
  DetailBalanceConvertSmallRequest,
  DetailBalanceConvertSmallByIdsRequest,
} from './balance-convert-small.dto'

export interface IGetResponse<T> {
  data: T[]
}

export interface IBalanceConvertSmallService {
  list(
    params: ListBalanceConvertSmallRequest,
  ): Observable<IResponseWithPagination<BalanceConvertSmall>>
  listDetail(
    params: DetailBalanceConvertSmallRequest,
  ): Observable<IGetResponse<BalanceConvertSmallDetail>>
  listDetailByIds(
    params: DetailBalanceConvertSmallByIdsRequest,
  ): Observable<IGetResponse<BalanceConvertSmallDetail>>
}
