import { Injectable, Logger } from '@nestjs/common'
import { ApiManagementService } from '@lib/grpc-client/api-management/api-management.service'
import {
  ApiKeysDto,
  ApproveKeyRequest,
  GetApiKeysResponse,
  IApproveKeyRequest,
  IDetailApiKey,
  IGetApiKeysDto,
  StatusHistoriesDto,
} from '@lib/grpc-client/api-management/api-management.dto'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'

@Injectable()
export class ApiKeyManagementService {
  protected readonly logger = new Logger(ApiKeyManagementService.name)

  constructor(private readonly apiManagementService: ApiManagementService) {}

  async getApiKeys(query: IGetApiKeysDto): Promise<GetApiKeysResponse> {
    return this.apiManagementService.getApiKeys(query)
  }

  async detailApiKey(request: IDetailApiKey): Promise<ApiKeysDto> {
    return this.apiManagementService.detailApiKey(request)
  }

  async approveKeyRequest(
    body: ApproveKeyRequest,
    req: IRequestWithAccessToken,
  ): Promise<ApiKeysDto> {
    const request: IApproveKeyRequest = {
      id: body.id,
      comment: body.comment,
      adminId: req.accessTokenInfo ? req.accessTokenInfo.uid.toString() : '0',
    }
    return this.apiManagementService.approveKeyRequest(request)
  }

  async getStatusHistories(apiKeyId: string): Promise<StatusHistoriesDto[]> {
    const result = await this.apiManagementService.getStatusHistories({
      apiKeyId,
    })
    return result.data.length === 0 ? [] : result.data
  }
}
