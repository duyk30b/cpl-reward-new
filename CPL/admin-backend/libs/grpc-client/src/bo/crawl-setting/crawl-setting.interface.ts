import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcSettingService {
  //BO Crawl Setting
  listBOCrawlSetting(listRequest): Observable<IGrpcResponse>
  addBOCrawlSetting(
    addRequest: IGrpcBOCrawlSettingAddRequest,
  ): Observable<IGrpcResponse>
  updateBOCrawlSetting(
    updateRequest: IGrpcBOCrawlSettingUpdateRequest,
  ): Observable<IGrpcResponse>
  deleteBOCrawlSetting(
    deleteRequest: IGrpcBOCrawlSettingDeleteRequest,
  ): Observable<IGrpcResponse>
}

//Crawl Setting
export interface IGrpcBOCrawlSetting {
  id: number
  settingKey: string
  settingValue: string
  active: number
}

export interface IGrpcBOCrawlSettingAddRequest {
  settingKey: string
  settingValue: string
  active: number
}

export interface IGrpcBOCrawlSettingUpdateRequest {
  id?: number
  settingKey: string
  settingValue: string
  active: number
}

export interface IGrpcBOCrawlSettingDeleteRequest {
  id: number
}
