import ApiService from '@/core/services/ApiService'
import {
  GetGridDetailRequestDto,
  GetStrategyDetailResponse,
} from '@/models/spot-grid-trading/grid-detail.dto'
import { GetOpenOrderResponse } from '@/models/spot-grid-trading/grid-open-order.dto'
import {
  GetGridPaginationDto,
  GetListGridResponseDto,
} from '@/models/spot-grid-trading/grid.dto'
import {
  GetTradeHistoryRequestDto,
  GetTradeHistoryResponse,
  GetTradeHistorySummaryRequest,
  GetTradeHistorySummaryResponse,
} from '@/models/spot-grid-trading/trade-history.dto'
import '@vue/runtime-core'
import { AxiosResponse } from 'axios'
import { instanceToPlain, plainToInstance } from 'class-transformer'

export class SpotGridTradingService {
  public static async getListGrids(
    params: GetGridPaginationDto,
  ): Promise<AxiosResponse<GetListGridResponseDto>> {
    const response = await ApiService.get<GetListGridResponseDto>(
      `/api-grid-trading`,
      {
        params: instanceToPlain(params, { exposeUnsetFields: true }),
      },
    )
    response.data = plainToInstance(GetListGridResponseDto, response.data)
    return response
  }

  public static async getStrategyDetail(
    params: GetGridDetailRequestDto,
  ): Promise<AxiosResponse<GetStrategyDetailResponse>> {
    return ApiService.get<GetStrategyDetailResponse>(
      `/api-grid-trading/detail`,
      {
        params: instanceToPlain(params, { exposeUnsetFields: true }),
      },
    )
  }

  public static async getOpenOrder(
    strategyId: string,
  ): Promise<GetOpenOrderResponse> {
    const response = await ApiService.get<GetOpenOrderResponse>(
      `/api-grid-trading/open-order/${strategyId}`,
    )
    return plainToInstance(GetOpenOrderResponse, response.data)
  }

  public static async getTradeHistorySummary(
    params: GetTradeHistorySummaryRequest,
  ): Promise<GetTradeHistorySummaryResponse> {
    const response = await ApiService.get<GetTradeHistorySummaryResponse>(
      `/api-grid-trading/trade-history-summary`,
      {
        params: instanceToPlain(params, { exposeUnsetFields: true }),
      },
    )
    return plainToInstance(GetTradeHistorySummaryResponse, response.data)
  }

  public static async getTradeHistory(
    params: GetTradeHistoryRequestDto,
  ): Promise<AxiosResponse<GetTradeHistoryResponse>> {
    return await ApiService.get<GetTradeHistoryResponse>(
      `/api-grid-trading/trade-history`,
      {
        params: instanceToPlain(params, { exposeUnsetFields: true }),
      },
    )
  }
}
