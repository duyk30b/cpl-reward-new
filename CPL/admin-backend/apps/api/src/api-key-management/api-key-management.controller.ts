import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Param,
  Req,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiKeyManagementService } from './api-key-management.service'
import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'
import {
  ApiKeysDto,
  ApproveKeyRequest,
  GetApiKeysResponse,
  IGetApiKeysDto,
  StatusHistoriesDto,
} from '@lib/grpc-client/api-management/api-management.dto'
import { instanceToPlain } from 'class-transformer'
import { ApiBadRequestResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator'
import { IApiBadRequestResponse } from '@app/common/common.dto'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'

@ApiTags('Api key management')
@Controller('api-key-management')
export class ApiKeyManagementController {
  constructor(
    private readonly apiKeyManagementService: ApiKeyManagementService,
  ) {}

  @Get('/histories/:id')
  @CheckPermission(Permission.API_MANAGEMENT_DETAIL)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get status histories by api key id' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [StatusHistoriesDto] })
  async getStatusHistories(@Param('id') id: string) {
    return await this.apiKeyManagementService.getStatusHistories(id)
  }

  @Post('/approve-key-request')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.API_MANAGEMENT_CHANGE_STATUS)
  @ApiBody({ type: ApproveKeyRequest })
  @ApiCreatedResponse({ type: ApiKeysDto })
  @ApiBadRequestResponse({ type: IApiBadRequestResponse })
  async approveKeyRequest(
    @Body() body: ApproveKeyRequest,
    @Req() request: IRequestWithAccessToken,
  ) {
    return this.apiKeyManagementService.approveKeyRequest(body, request)
  }

  @Get('/list')
  @CheckPermission(Permission.API_MANAGEMENT_LIST)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get keys by pagination' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GetApiKeysResponse })
  public async getKeys(@Query() query: IGetApiKeysDto) {
    return instanceToPlain(await this.apiKeyManagementService.getApiKeys(query))
  }

  @Get('/:id')
  @CheckPermission(Permission.API_MANAGEMENT_DETAIL)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get key by id' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ApiKeysDto })
  async detailKey(@Param('id') id: string) {
    return await this.apiKeyManagementService.detailApiKey({ id })
  }
}
