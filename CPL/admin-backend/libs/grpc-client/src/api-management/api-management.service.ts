import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { IApiManagement } from './api-management.interface'
import { ApiManagementConstant } from './api-management.constant'
import { lastValueFrom, map } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import {
  ApiKeysDto,
  GetApiKeysResponse,
  GetStatusHistoriesResponse,
  IApproveKeyRequest,
  IDetailApiKey,
  IGetApiKeysDto,
  IStatusHistories,
} from '@lib/grpc-client/api-management/api-management.dto'

@Injectable()
export class ApiManagementService implements OnModuleInit {
  // private readonly logger = new Logger(LanguageSettingService.name)
  private apiManagement: IApiManagement

  constructor(
    @Inject(ApiManagementConstant.GRPC_API_MANAGEMENT_TOKEN)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.apiManagement = this.client.getService<IApiManagement>(
      ApiManagementConstant.GRPC_API_MANAGEMENT_SERVICE,
    )
  }

  public getApiKeys(request: IGetApiKeysDto): Promise<GetApiKeysResponse> {
    return lastValueFrom(
      this.apiManagement.getApiKeys(request).pipe(
        map((result) =>
          plainToInstance(GetApiKeysResponse, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public approveKeyRequest(request: IApproveKeyRequest): Promise<ApiKeysDto> {
    return lastValueFrom(
      this.apiManagement.approveKeyRequest(request).pipe(
        map((result) =>
          plainToInstance(ApiKeysDto, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public detailApiKey(request: IDetailApiKey): Promise<ApiKeysDto> {
    return lastValueFrom(
      this.apiManagement.detailApiKey(request).pipe(
        map((result) =>
          plainToInstance(ApiKeysDto, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public getStatusHistories(
    request: IStatusHistories,
  ): Promise<GetStatusHistoriesResponse> {
    return lastValueFrom(
      this.apiManagement.getStatusHistories(request).pipe(
        map((result) =>
          plainToInstance(GetStatusHistoriesResponse, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }
}
