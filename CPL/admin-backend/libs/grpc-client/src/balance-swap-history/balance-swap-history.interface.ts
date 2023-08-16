import { Observable } from 'rxjs'
import {
  ListBalanceSwapRequest,
  ListBalanceSwapResponse,
} from './balance-swap-history.dto'

export interface IBalanceSwapHistoryService {
  list(params: ListBalanceSwapRequest): Observable<ListBalanceSwapResponse>
}
