import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { Observable } from 'rxjs'
import { BalanceAccountDto } from '../balance-account/balance-account.dto'
import { BalanceTransaction } from '../balance-transaction/balance-transaction.dto'
import { BalanceTransferDto } from './balance-transfer.dto'

export interface ISelfTransferRequest {
  userId: string
  currency: string
  balanceTypeFrom: string
  balanceTypeTo: string
  amount: string
}

export interface ITransferRequest {
  transferReferenceId: string
  userIdFrom: string
  userIdTo: string
  currency: string
  balanceTypeFrom: string
  balanceTypeTo: string
  amount: string
}

export interface ITransferResponse {
  balanceTransfer: BalanceTransferDto
  balanceAccounts: BalanceAccountDto[]
  balanceTransactions: BalanceTransaction[]
}

export interface IListTransferRequest {
  currencies: string[]
  userIds: string[]
  balanceTypeFrom?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
  sort?: string
  sortType?: string
}

export interface IListTransferResponse {
  data: BalanceTransferDto[]
  pagination: IPaginationMeta
}

export interface IBalanceTransferService {
  self(request: ISelfTransferRequest): Observable<ITransferResponse>
  transfer(request: ITransferRequest): Observable<ITransferResponse>
  list(request: IListTransferRequest): Observable<IListTransferResponse>
}
