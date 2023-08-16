import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { Observable } from 'rxjs'
import { BalanceHistoryEntityResultDto } from './balance-history.dto'

export interface IListHistoryRequest {
  currency?: string
  userId?: string
  transactionType?: string
  searchField?: string
  searchText?: string
  page?: number
  size?: number
  sort?: string
  sortType?: string
  balanceType?: string
  startDate?: string
  endDate?: string
}

export interface IListHistoryResponse {
  data: BalanceHistoryEntityResultDto[]
  pagination: IPaginationMeta
}

export interface IBalanceHistoryService {
  list(request: IListHistoryRequest): Observable<IListHistoryResponse>
}
