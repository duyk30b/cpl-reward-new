import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcSettingService {
  getTradingPair?(Object): Observable<IGrpcResponse>
  getPeriod?(Object): Observable<IGrpcResponse>
  getOneMode?(Number): Observable<IGrpcResponse>

  //BO Setting
  listBOSetting(listRequest): Observable<IGrpcResponse>
  addBOSetting(addRequest: IGrpcBOSettingAddRequest): Observable<IGrpcResponse>
  findOneBOSetting(
    findOneRequest: IGrpcBOSettingFindOneRequest,
  ): Observable<IGrpcResponse>
  updateBOSetting(
    updateRequest: IGrpcBOSettingUpdateRequest,
  ): Observable<IGrpcResponse>
  deleteBOSetting(
    deleteRequest: IGrpcBOSettingDeleteRequest,
  ): Observable<IGrpcResponse>

  getBTCTransferSetting(Object): Observable<IGrpcResponse>
  updateBTCTransferSetting(
    updateRequest: IGrpcBTCTransferRequest,
  ): Observable<IGrpcResponse>
  getMajorCoin({}): Observable<IGrpcResponse>
  getDetailMajorCoin(
    findOneRequest: IGrpcBOMajorCoinDtoFindOneRequest,
  ): Observable<IGrpcResponse>
  createMajorCoin(
    createRequest: IGrpcBOMajorCoinDtoAddRequest,
  ): Observable<IGrpcResponse>
  updateMajorCoin(
    updateRequest: IGrpcBOMajorCoinDtoUpdateRequest,
  ): Observable<IGrpcResponse>
  deletelMajorCoin(
    deleteRequest: IGrpcBOMajorCoinDtoFindOneRequest,
  ): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcSetting {
  id: number
  name: string
}

////////////// REQUEST ////////////////
export interface IGrpcBOSettingAddRequest {
  code: string
  value: string
  active: number
}

export interface IGrpcBOSettingUpdateRequest {
  id?: number
  code: string
  value: string
  active: number
}
export interface IGrpcBTCTransferRequest {
  items: IGrpcBOSettingUpdateRequest[]
}

export interface IGrpcBOSettingFindOneRequest {
  id?: number
  code: string
  value: string
  active: number
}

export interface IGrpcBOSettingListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IGrpcBOSettingDeleteRequest {
  id: number
}

export interface IGrpcBOSetting {
  id: number
  code: string
  value: string
  active: number
}

//Trading Mode
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

export interface IGrpcTradingModeDeleteRequest {
  id: number
}

export interface IGrpcBOMajorCoinDtoFindOneRequest {
  coin: string
}

export interface IGrpcBOMajorCoinDtoAddRequest {
  coin: string
  transferFee: number
  transferMaxFee: number
  transferMinFee: number
  transferMaxAmount: number
  transferMinAmount: number
  transferFeeRatio: number
  transferActive: boolean
  transferMaxAmountPerDay: number
}

export interface IGrpcBOMajorCoinDtoUpdateRequest {
  coin: string
  transferFee: number
  transferMaxFee: number
  transferMinFee: number
  transferMaxAmount: number
  transferMinAmount: number
  transferFeeRatio: number
  transferActive: boolean
  transferMaxAmountPerDay: number
}
