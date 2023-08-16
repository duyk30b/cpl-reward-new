import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { Constants } from './constants'
import {
  GetGridTradingRequestDto,
  GrpcGetGridDetailRequestDto,
  GrpcGetTradeHistoryRequestDto,
  GrpcGetTradeHistorySummaryRequestDto,
  GrpcOpenOrderRequestDto,
} from './dtos/grid-trading-input.dto'
import {
  GrpcGetOpenOrderResponse,
  GrpcGetTradeHistoryResponse,
  GrpcGetTradeHistorySummaryResponse,
  GrpcGridTradingResponse,
  GrpcStrategyDetailResponse,
} from './dtos/grpc-grid-trading.dto'
import { IGrpcGridTrading } from './interfaces/grid-trading.interface'

@Injectable()
export class GridTradingService implements OnModuleInit {
  private grpcGridTrading: IGrpcGridTrading
  constructor(
    @Inject(Constants.GRPC_GRID_TRADING_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.grpcGridTrading = this.clientGrpc.getService(
      Constants.GRPC_GRID_TRADING_SERVICE,
    )
  }

  public getGridTrading(
    request: GetGridTradingRequestDto,
  ): Promise<GrpcGridTradingResponse> {
    return lastValueFrom(
      this.grpcGridTrading.getListGrids(request).pipe(
        map((result) =>
          plainToInstance(GrpcGridTradingResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public getOpenOrder(
    request: GrpcOpenOrderRequestDto,
  ): Promise<GrpcGetOpenOrderResponse> {
    return lastValueFrom(
      this.grpcGridTrading.getOpenOrder(request).pipe(
        map((result) =>
          plainToInstance(GrpcGetOpenOrderResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public getStrategyDetail(
    request: GrpcGetGridDetailRequestDto,
  ): Promise<GrpcStrategyDetailResponse> {
    return lastValueFrom(
      this.grpcGridTrading.getStrategyDetail(request).pipe(
        map((result) =>
          plainToInstance(GrpcStrategyDetailResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public getTradeHistorySummary(
    request: GrpcGetTradeHistorySummaryRequestDto,
  ): Promise<GrpcGetTradeHistorySummaryResponse> {
    return lastValueFrom(
      this.grpcGridTrading.getTradeHistorySummary(request).pipe(
        map((result) =>
          plainToInstance(GrpcGetTradeHistorySummaryResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public getTradeHistory(
    request: GrpcGetTradeHistoryRequestDto,
  ): Promise<GrpcGetTradeHistoryResponse> {
    return lastValueFrom(
      this.grpcGridTrading.getTradeHistory(request).pipe(
        map((result) =>
          plainToInstance(GrpcGetTradeHistoryResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }
}
