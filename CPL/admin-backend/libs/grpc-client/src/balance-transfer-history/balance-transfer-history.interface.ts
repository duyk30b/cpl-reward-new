import { Observable } from 'rxjs'
import {
  ListBalanceTransferRequest,
  ListBalanceTransferResponse,
} from './balance-transfer-history.dto'

export interface IBalanceTransferHistoryService {
  list(
    params: ListBalanceTransferRequest,
  ): Observable<ListBalanceTransferResponse>
}
