import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcPairSettingService {
  //Pair Setting
  listPairSetting(listRequest): Observable<IGrpcResponse>
  addPairSetting(
    addRequest: IGrpcPairSettingAddRequest,
  ): Observable<IGrpcResponse>
  updatePairSetting(
    updateRequest: IGrpcPairSettingUpdateRequest,
  ): Observable<IGrpcResponse>
  deletePairSetting(
    deleteRequest: IGrpcPairSettingDeleteRequest,
  ): Observable<IGrpcResponse>
  exportPairSetting(
    listRequest: IGrpcPairSettingRequest,
  ): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcPairSettingRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  lang?: string
}

export interface IGrpcSetting {
  id: number
  name: string
}

export interface IGrpcPairSettingAddRequest {
  pairId: number
  decimalPart: number
  highlowSpread: number
  turboSpread: number
  emergencyThreshold: number
}

export interface IGrpcPairSettingUpdateRequest {
  id: number
  pairId: number
  decimalPart: number
  highlowSpread: number
  turboSpread: number
  emergencyThreshold: number
}

export interface IGrpcPairSettingDeleteRequest {
  id: number
}
