import { Observable } from 'rxjs'
import {
  CancelOrderByIdsResponseDto,
  CancelOrderByUserIdRequestDto,
  CancelOrderRequestDto,
} from '../dtos/cancel-order.dto'
import {
  CreateOrderRequestDto,
  CreateOrderResponse,
} from '../dtos/create-order.dto'
import {
  ExportTradeHistoryRequestDto,
  GetListTradeHistoryQueryDto,
  GrpcExportTradeHistoryResponse,
  GrpcTradeHistoryPaginationResponse,
} from '../dtos/get-list-trade-history.dto'
import {
  ListOpenOrderRequest,
  ListOpenOrderResponse,
} from '../dtos/list-open-order.dto'
import {
  ExportOpenOrderRequestDto,
  GetOpenOrderQueryDto,
  GrpcExportOpenOrderResponse,
  GrpcOpenOrderPaginationResponse,
} from '../dtos/open-order.dto'
import {
  GetOrderHistoryQueryDto,
  GrpcOrderHistoryPaginationResponse,
} from '../dtos/order-history.dto'

export interface IExchangeOrder {
  getOrderHistory: (
    request: GetOrderHistoryQueryDto,
  ) => Observable<GrpcOrderHistoryPaginationResponse>
  getOpenOrder: (
    request: GetOpenOrderQueryDto,
  ) => Observable<GrpcOpenOrderPaginationResponse>
  exportOpenOrder: (
    request: ExportOpenOrderRequestDto,
  ) => Observable<GrpcExportOpenOrderResponse>
  cancelOrderByIds: (
    request: CancelOrderRequestDto,
  ) => Observable<CancelOrderByIdsResponseDto>
  cancelOrderByUserId: (
    request: CancelOrderByUserIdRequestDto,
  ) => Observable<CancelOrderByIdsResponseDto>
  getTradeHistory: (
    request: GetListTradeHistoryQueryDto,
  ) => Observable<GrpcTradeHistoryPaginationResponse>
  exportTradeHistory: (
    request: ExportTradeHistoryRequestDto,
  ) => Observable<GrpcExportTradeHistoryResponse>
  createOrder: (
    request: CreateOrderRequestDto,
  ) => Observable<CreateOrderResponse>
  getListOrderByUserId: (
    request: ListOpenOrderRequest,
  ) => Observable<ListOpenOrderResponse>
}
