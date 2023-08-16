import { Observable } from 'rxjs'
import { IResponseWithPagination } from '../grpc-client.interface'
import {
  ListBalanceConvertRequest,
  ListBalanceConvertLogRequest,
  GetBalanceConvertRequest,
  CreateBalanceConvertRequest,
  UpdateBalanceConvertRequest,
  DeleteBalanceConvertRequest,
  BalanceConvert,
  BalanceConvertLog,
} from './balance-convert.dto'

export interface IBalanceConvertService {
  get(params: GetBalanceConvertRequest): Observable<BalanceConvert>
  list(
    params: ListBalanceConvertRequest,
  ): Observable<IResponseWithPagination<BalanceConvert>>
  create(body: CreateBalanceConvertRequest): Observable<BalanceConvert>
  update(body: UpdateBalanceConvertRequest): Observable<BalanceConvert>
  delete(params: DeleteBalanceConvertRequest): Observable<BalanceConvert>
  listLog(
    params: ListBalanceConvertLogRequest,
  ): Observable<IResponseWithPagination<BalanceConvertLog>>
}
