import { Observable } from 'rxjs'
import {
  CancelOrderRequest,
  CancelOrderResponse,
  OrderData,
  SearchOrderRequest,
} from './futures-integrate.dto'

export interface FuturesIntegrate {
  getList: (request: SearchOrderRequest) => Observable<OrderData>
  getListOrderHistories: (request: SearchOrderRequest) => Observable<OrderData>
  cancelOrder: (request: CancelOrderRequest) => Observable<CancelOrderResponse>
  cancelAllOrder: () => Observable<CancelOrderResponse>
}
