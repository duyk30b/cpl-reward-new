import ApiService from '@/core/services/ApiService'
import {
  CreateGridTradingItemDto,
  DeleteGridTradingResponseDto,
  GetAllPairNameOfGridResponseDto,
  GetGridTradingPaginationDto,
  GetGridTradingPairResponseDto,
  TradingPairItemDto,
  UpdateGridTradingItemDto,
  UpdateOrderOfPairRequestDto,
  UpdateOrderOfPairResponse,
} from '@/models/spot-grid-trading/trading-pair-item.dto'
import { AxiosResponse } from 'axios'
import {
  instanceToInstance,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer'

export class SpotGridTradingSettingService {
  public static async getTradingPair(
    params: GetGridTradingPaginationDto,
  ): Promise<AxiosResponse<GetGridTradingPairResponseDto>> {
    const response = await ApiService.get<GetGridTradingPairResponseDto>(
      `/api-grid-trading-setting`,
      {
        params: instanceToPlain(params, { exposeUnsetFields: true }),
      },
    )
    response.data = plainToInstance(
      GetGridTradingPairResponseDto,
      response.data,
    )
    return response
  }

  public static async getAllPairNameOfGrid(): Promise<
    AxiosResponse<GetAllPairNameOfGridResponseDto>
  > {
    const response = await ApiService.get<GetAllPairNameOfGridResponseDto>(
      `/api-grid-trading-setting/all-pair-name`,
    )
    response.data = plainToInstance(
      GetAllPairNameOfGridResponseDto,
      response.data,
    )
    return response
  }

  public static async deleteTradingPair(
    id: string,
  ): Promise<AxiosResponse<DeleteGridTradingResponseDto>> {
    const response = await ApiService.delete<DeleteGridTradingResponseDto>(
      `/api-grid-trading-setting/${id}`,
    )
    return response
  }

  public static async patchTradingPair(
    body: UpdateGridTradingItemDto,
  ): Promise<AxiosResponse<TradingPairItemDto>> {
    const response = await ApiService.patch<TradingPairItemDto>(
      `/api-grid-trading-setting`,
      instanceToPlain(body),
    )
    return response
  }

  public static async createTradingPair(
    body: CreateGridTradingItemDto,
  ): Promise<AxiosResponse<TradingPairItemDto>> {
    const response = await ApiService.post<TradingPairItemDto>(
      `/api-grid-trading-setting`,
      instanceToPlain(body),
    )
    return response
  }

  public static async updateOrderPair(
    body: UpdateOrderOfPairRequestDto,
  ): Promise<AxiosResponse<UpdateOrderOfPairResponse>> {
    const response = await ApiService.patch<UpdateOrderOfPairResponse>(
      `/api-grid-trading-setting/order-pair`,
      instanceToInstance(body, { excludeExtraneousValues: true }),
    )
    return response
  }
}
