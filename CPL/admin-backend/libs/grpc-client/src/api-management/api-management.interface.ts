import {
  ApiKeysDto,
  GetApiKeysResponse,
  GetStatusHistoriesResponse,
  IApproveKeyRequest,
  IDetailApiKey,
  IGetApiKeysDto,
  IStatusHistories,
} from './api-management.dto'
import { Observable } from 'rxjs'

export interface IApiManagement {
  getApiKeys: (request: IGetApiKeysDto) => Observable<GetApiKeysResponse>
  approveKeyRequest: (request: IApproveKeyRequest) => Observable<ApiKeysDto>
  detailApiKey: (request: IDetailApiKey) => Observable<ApiKeysDto>
  getStatusHistories: (
    request: IStatusHistories,
  ) => Observable<GetStatusHistoriesResponse>
}
