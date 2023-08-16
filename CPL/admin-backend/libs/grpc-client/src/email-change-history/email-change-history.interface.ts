import { Observable } from 'rxjs'
import { IPaginationMeta } from '@lib/grpc-client'
import { IBaseFilter } from '../grpc-client.interface'

export interface IEmailChangeHistoryFilter extends IBaseFilter {
  userId: string
  isModifiedByUser?: boolean
}

export interface IListUserEmailChangeHistoryResponse {
  data: IUserEmailChangeHistory[]
  pagination: IPaginationMeta
}

export interface IUserEmailChangeHistory {
  id: string
  userId: string
  oldEmail: string
  newEmail: string
  isModifiedByUser: boolean
  createdAt: string
}

export interface IUserEmailChangeHistoryService {
  getListEmailChangeHistory(
    filter: IEmailChangeHistoryFilter,
  ): Observable<IListUserEmailChangeHistoryResponse>
}
