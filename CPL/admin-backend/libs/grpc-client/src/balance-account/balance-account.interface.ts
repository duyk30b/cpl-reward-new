import { Observable } from 'rxjs'
import { BalanceAccountDto } from './balance-account.dto'
export interface IBalanceAccountTypes {
  [key: string]: Partial<BalanceAccountDto>[]
}
export interface ITotalBalanceAccountResponse {
  items: IBalanceAccountTypes
  total: Partial<BalanceAccountDto>[]
}
export interface IListForUserRequest {
  userId: string
}

export class IBalanceAccountResponse {
  items: BalanceAccountDto[]
}
export interface IBalanceAccountService {
  listForUser(request: IListForUserRequest): Observable<IBalanceAccountResponse>
}
