import { Observable } from 'rxjs'
import {
  CreateTransactionRequest,
  CreateTransactionResponse,
} from './balance-transaction.dto'

export interface IBalanceTransactionService {
  create(
    request: CreateTransactionRequest,
  ): Observable<CreateTransactionResponse>
  getBalanceChangeHistory(request): Observable<any>
}
