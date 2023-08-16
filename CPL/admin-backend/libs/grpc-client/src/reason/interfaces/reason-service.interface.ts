import { Observable } from 'rxjs'
import {
  IBaseReasonResponse,
  ICreateReason,
  IReason,
  IReasonFilter,
  IReasonId,
  IReasonList,
} from '@lib/grpc-client/reason/interfaces/reason.interface'

export interface IReasonService {
  create(createReason: ICreateReason): Observable<IBaseReasonResponse>
  findAll(reasonFilter: IReasonFilter): Observable<IReasonList>
  findById(reasonId: IReasonId): Observable<IReason>
  update(reason: IReason): Observable<IBaseReasonResponse>
  delete(reasonId: IReasonId): Observable<IBaseReasonResponse>
}
