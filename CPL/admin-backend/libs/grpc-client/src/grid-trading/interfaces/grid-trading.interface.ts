import { Observable } from 'rxjs'
import {
  GetGridTradingRequestDto,
  GrpcGetGridDetailRequestDto,
  GrpcGetTradeHistoryRequestDto,
  GrpcGetTradeHistorySummaryRequestDto,
  GrpcOpenOrderRequestDto,
} from '../dtos/grid-trading-input.dto'
import {
  GrpcGetOpenOrderResponse,
  GrpcGetTradeHistoryResponse,
  GrpcGetTradeHistorySummaryResponse,
  GrpcGridTradingResponse,
  GrpcStrategyDetailResponse,
} from '../dtos/grpc-grid-trading.dto'

export interface IGrpcGridTrading {
  getListGrids: (
    request: GetGridTradingRequestDto,
  ) => Observable<GrpcGridTradingResponse>
  getOpenOrder: (
    request: GrpcOpenOrderRequestDto,
  ) => Observable<GrpcGetOpenOrderResponse>
  getStrategyDetail: (
    request: GrpcGetGridDetailRequestDto,
  ) => Observable<GrpcStrategyDetailResponse>
  getTradeHistorySummary: (
    request: GrpcGetTradeHistorySummaryRequestDto,
  ) => Observable<GrpcGetTradeHistorySummaryResponse>
  getTradeHistory: (
    request: GrpcGetTradeHistoryRequestDto,
  ) => Observable<GrpcGetTradeHistoryResponse>
}
