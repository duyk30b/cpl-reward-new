import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { Observable } from 'rxjs'
import {
  AbnormalBalanceAccountEntityDto,
  AbnormalBalanceHistoryEntityDto,
  AbnormalBalanceUserEntityDto,
  ResponseCorrectEntity,
  ResponseGetDiffBalanceEntity,
} from './balance-monitor.dto'

export interface ICorrectRequest {
  userId: string
  currency: string
  balanceType: number
  correctedType: number
  correctedBy: string
  diffActualBalance: string
  diffAvailableBalance: string
  reason: string
}

export interface IGetDiffBalanceRequest {
  userId: string
  currency: string
  balanceType: number
}

export interface ICheckBalanceInvalidRequest {
  userId: string
  currency?: string
  balanceType?: number
  runType: number
}

export interface IGetAbnormalBalanceUsersRequest {
  page?: number
  size?: number
  userIds?: string[]
}

export interface IGetAbnormalBalanceUsersResponse {
  data: AbnormalBalanceUserEntityDto[]
  pagination: IPaginationMeta
}

export interface IGetAbnormalBalanceAccountsRequest {
  userId: string
}

export interface IGetAbnormalBalanceAccountsResponse {
  data: AbnormalBalanceAccountEntityDto[]
}

export interface IGetAbnormalBalanceHistoriesRequest {
  userId?: string
  currency?: string
  balanceType?: string
  transactionType?: string
  status?: string
  page?: number
  size?: number
  sort?: string
  sortType?: string
  getAll?: boolean
}

export interface IGetAbnormalBalanceHistoriesResponse {
  data: AbnormalBalanceHistoryEntityDto[]
  pagination: IPaginationMeta
}

export interface IBalanceMonitorService {
  correct(request: ICorrectRequest): Observable<ResponseCorrectEntity>
  getDiffBalanceCorrect(
    request: IGetDiffBalanceRequest,
  ): Observable<ResponseGetDiffBalanceEntity>
  checkBalanceInvalid(request: ICheckBalanceInvalidRequest): Observable<any>
  getAbnormalBalanceUsers(
    request: IGetAbnormalBalanceUsersRequest,
  ): Observable<IGetAbnormalBalanceUsersResponse>
  getAbnormalBalanceAccounts(
    request: IGetAbnormalBalanceAccountsRequest,
  ): Observable<IGetAbnormalBalanceAccountsResponse>
  getAbnormalBalanceHistories(
    request: IGetAbnormalBalanceHistoriesRequest,
  ): Observable<IGetAbnormalBalanceHistoriesResponse>
}
