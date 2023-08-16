import { Observable } from 'rxjs'
import {
  GetOrderbookQueryDto,
  OrderbookResponseDto,
} from '../dtos/orderbook.dto'

export interface IExchangeOrderbook {
  getOrderbook: (
    request: GetOrderbookQueryDto,
  ) => Observable<OrderbookResponseDto>
}
