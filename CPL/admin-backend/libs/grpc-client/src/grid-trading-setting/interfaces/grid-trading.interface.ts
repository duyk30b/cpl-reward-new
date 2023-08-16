import { Observable } from 'rxjs'
import {
  BaseGridTradingSettingItemDto,
  DeleteGridTradingRequestDto,
  DeleteGridTradingResponseDto,
  GetAllPairNameRequest,
  GetGridTradingPaginationDto,
  GetGridTradingSettingFilterRequest,
  GridTradingSettingItemDto,
  GrpcGridTradingSettingDto,
  GrpcGridTradingSettingPaginationResponse,
  GrpcListPairNameResponse,
  UpdateOrderOfPairRequestDto,
  UpdateOrderOfPairResponse,
} from '../dtos'

export interface IGrpcGridTradingSetting {
  getGridTrading: (
    request: GetGridTradingSettingFilterRequest,
  ) => Observable<GrpcGridTradingSettingDto>
  getGridTradingByPagination: (
    request: GetGridTradingPaginationDto,
  ) => Observable<GrpcGridTradingSettingPaginationResponse>
  setGridTrading: (
    request: BaseGridTradingSettingItemDto,
  ) => Observable<GridTradingSettingItemDto>
  deleteGridTrading: (
    request: DeleteGridTradingRequestDto,
  ) => Observable<DeleteGridTradingResponseDto>
  updateOrderOfPair: (
    request: UpdateOrderOfPairRequestDto,
  ) => Observable<UpdateOrderOfPairResponse>
  getAllPairName: (
    request: GetAllPairNameRequest,
  ) => Observable<GrpcListPairNameResponse>
}
