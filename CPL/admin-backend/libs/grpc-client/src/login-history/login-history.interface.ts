import { Observable } from 'rxjs'
import { IPaginationMeta } from '@lib/grpc-client'

export interface ILoginHistoryFilter {
  page?: number
  perPage?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  fromTime?: string
  toTime?: string
}

export interface IListUserLoginHistory {
  data: IUserLoginHistoryResponse[]
  pagination: IPaginationMeta
}

export interface IUserLoginHistoryResponse {
  email: string
  createdAt: string
  ip: string
  browser: string
  os: string
}

export interface IUserLoginHistoryService {
  getListLoginHistory(
    userFilter: ILoginHistoryFilter,
  ): Observable<IListUserLoginHistory>
}
