import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiWithdrawService } from './api-auto-withdraw.service'
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'
import {
  CreateWithdrawGroupRequest,
  getListAutoWithdrawRequest,
  getListAutoWithdrawResponse,
  HealthStatusValue,
  ListWithdrawGroupRequest,
  ListWithdrawGroupResponse,
  saveAutoWithdrawRequest,
  TransactionParams,
  UpdateGroupStatusRequest,
  withdrawalGroupRequest,
  DuplicateWithdrawRequest,
} from '@lib/grpc-client/withdraw'
import { HttpService } from '@nestjs/axios'
import { Param } from '@nestjs/common'

@Controller('withdraw')
@ApiTags('withdraw')
export class WithdrawController {
  private logger = new Logger(WithdrawController.name)
  constructor(
    private readonly apiWithdrawService: ApiWithdrawService,
    private readonly httpService: HttpService,
  ) {}

  @ApiOperation({ summary: 'Get withdraw group' })
  @Get('withdraw-group')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.AUTO_WITHDRAW_GROUP_COMMON)
  async getListWithdrawalGroup(
    @Query() query: ListWithdrawGroupRequest,
  ): Promise<ListWithdrawGroupResponse> {
    return await this.apiWithdrawService.getListWithdrawalGroup(query)
  }

  @ApiOperation({ summary: 'Create withdraw group' })
  @Post('withdraw-group')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateWithdrawGroupRequest })
  @CheckPermission(Permission.AUTO_WITHDRAW_GROUP_CREATE_UPDATE)
  async createWithdrawalGroup(
    @Body()
    body: CreateWithdrawGroupRequest,
  ) {
    return await this.apiWithdrawService.createWithdrawalGroup(body)
  }

  @ApiOperation({ summary: 'generate key' })
  @Post('generate-key')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: withdrawalGroupRequest })
  @CheckPermission(Permission.AUTO_WITHDRAW_GENERATE_KEY)
  async generatePrivateKey(
    @Body()
    body: withdrawalGroupRequest,
  ) {
    return await this.apiWithdrawService.generatePrivateKey(body)
  }

  @ApiOperation({ summary: 'update status group' })
  @Put('withdraw-group')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateGroupStatusRequest })
  @CheckPermission(Permission.AUTO_WITHDRAW_GROUP_CREATE_UPDATE)
  async updateStatus(
    @Body()
    body: UpdateGroupStatusRequest,
  ) {
    return await this.apiWithdrawService.updateStatus(body)
  }

  @ApiOperation({ summary: 'Get list auto' })
  @Get('auto-withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.AUTO_WITHDRAW_GROUP_DETAIL)
  async getListAutoWithdraw(
    @Query() query: getListAutoWithdrawRequest,
  ): Promise<getListAutoWithdrawResponse> {
    return await this.apiWithdrawService.getListAutoWithdraw(query)
  }

  @ApiOperation({ summary: 'update exchange setting' })
  @Put('auto-withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: saveAutoWithdrawRequest })
  @CheckPermission(Permission.AUTO_WITHDRAW_GROUP_DETAIL)
  async saveAutoWithdrawals(
    @Body()
    body: saveAutoWithdrawRequest,
  ) {
    return await this.apiWithdrawService.saveAutoWithdrawals(body)
  }

  @ApiOperation({ summary: 'Get healthcheck' })
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.AUTO_WITHDRAW_HEALTH)
  async health(): Promise<HealthStatusValue> {
    return await this.apiWithdrawService.health()
  }

  @ApiOperation({ summary: 'Get token' })
  @Get('currency')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.AUTO_WITHDRAW_CURRENCY)
  @HttpCode(HttpStatus.OK)
  getCurrency(): string[] {
    return process.env.TOKEN_WITHDRAW.split(',')
  }

  @ApiOperation({ summary: 'Get transaction list' })
  @Post('transaction')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.AUTO_WITHDRAW_TRANSACTION)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: TransactionParams })
  async getTransactionList(@Body() body: TransactionParams): Promise<any> {
    const params = body.transactionIds.join(',')
    const requestParams = {
      secret: process.env.BCE_ADMIN_INTERNAL_SECRET,
      payload: params,
    }

    if (!!body.status) {
      requestParams['status'] = body.status
    }

    try {
      const data = await this.httpService
        .post(
          `${process.env.BCE_ADMIN_URL}/api/internal/transactions/external-withdraws`,
          requestParams,
        )
        .toPromise()
      return data.data
    } catch (error) {
      this.logger.debug(error)
      throw new BadRequestException(error)
    }
  }

  @ApiOperation({
    summary:
      'Validate duplicate withdraw request, this api call before save transaction',
  })
  @Post('validate-transaction-ids')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.AUTO_WITHDRAW_TRANSACTION)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: DuplicateWithdrawRequest })
  validateDuplicateAutoWithdraw(
    @Body() body: DuplicateWithdrawRequest,
  ): Promise<any> {
    return this.apiWithdrawService.validateDuplicateAutoWithdraw(body)
  }

  @ApiOperation({
    summary: 'Collection current balance of requirement',
  })
  @Post(':groupId/collection')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.AUTO_WITHDRAW_TRANSACTION)
  @HttpCode(HttpStatus.OK)
  collectBalance(@Param('groupId') groupId: number): Promise<any> {
    return this.apiWithdrawService.collectionBalance(Number(groupId))
  }
}
