import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcTradingModeService {
  //Trading Mode
  list(listRequest: IGrpcTradingModeRequest): Observable<IGrpcResponse>
  export(listRequest: IGrpcTradingModeRequest): Observable<IGrpcResponse>
  findOne(
    findOneRequest: IGrpcTradingModeFindOneRequest,
  ): Observable<IGrpcResponse>
  create(addRequest: IGrpcTradingModeAddRequest): Observable<IGrpcResponse>
  update(
    updateRequest: IGrpcTradingModeUpdateRequest,
  ): Observable<IGrpcResponse>
  delete(
    deleteRequest: IGrpcTradingModeDeleteRequest,
  ): Observable<IGrpcResponse>
  getPeriod?(Object): Observable<IGrpcResponse>
}

//Trading Mode
export interface IGrpcTradingModeRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  getOnly?: string
  mode?: string
  period?: string
  lang?: string
  pairId?: string
  status?: string
}

export interface IGrpcTradingModeAddRequest {
  mode: string
  period: string
  startTime: string
  endTime: string
  payout: number
  suggestion1: number
  suggestion2: number
  suggestion3: number
  scalingActive: number
  scalingBcast: number
  payoutMax: number
  rankScalingActive: number
  limitOrderMin: number
  limitOrderMax: number
  limitOrderMaxAmount: number
  orderExpireTime: string
  orderUnit: number
  limitDayUnit: number
  limitOrderTimes: number
  limitOrderAmount: number
  stopThresholdValue: number
  restrictedDayUnit: number
  restrictedOrderTimes: number
  restrictedDayOrderTimes: number
  restrictedDayOrderAmount: number
  activeThresholdValue: number
  restrictedOrderAmount: number
  scalingValue: number
  rank1ScaleBcast: number
  rank2ScaleBcast: number
  rank3ScaleBcast: number
  apiToken: string
  allowResell: number
  oddsMode: number
  oddsFee: number
  payoutScalingUnit: number
  orderMinimum: number
  expireTime: number
  emergencyThreshold: number
  maxUsdtPerOrder: number
  maxBcastPerOrder: number
  sameDirectionInterval: number
  diffDirectionInterval: number
}

export interface IGrpcTradingModeUpdateRequest {
  id: number
  mode: string
  period: string
  startTime: string
  endTime: string
  payout: number
  suggestion_1: number
  suggestion_2: number
  suggestion_3: number
  scalingActive: number
  scalingBcast: number
  payoutMax: number
  rankScalingActive: number
  limitOrderMin: number
  limitOrderMax: number
  limitOrderMaxAmount: number
  orderExpireTime: string
  orderUnit: number
  limitDayUnit: number
  limitOrderTimes: number
  limitOrderAmount: number
  stopThresholdValue: number
  restrictedDayUnit: number
  restrictedOrderTimes: number
  restrictedDayOrderTimes: number
  restrictedDayOrderAmount: number
  activeThresholdValue: number
  restrictedOrderAmount: number
  scalingValue: number
  rank1ScaleBcast: number
  rank2ScaleBcast: number
  rank3ScaleBcast: number
  apiToken: string
  allowResell: number
  oddsMode: number
  oddsFee: number
  payoutScalingUnit: number
  orderMinimum: number
  expireTime: number
  emergencyThreshold: number
  maxUsdtPerOrder: number
  maxBcastPerOrder: number
  sameDirectionInterval: number
  diffDirectionInterval: number
}

export interface IGrpcTradingModeFindOneRequest {
  id?: number
}

export interface IGrpcTradingModeDeleteRequest {
  id: number
}
