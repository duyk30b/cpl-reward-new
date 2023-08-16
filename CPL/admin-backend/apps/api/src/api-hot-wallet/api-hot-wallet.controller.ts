import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { HotWalletService } from '@lib/grpc-client/hot-wallet/services'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'
import {
  BaseFilterQuery,
  GrpcFilterIncidentCollectionQuery,
  GrpcGetDepositResponse,
  GrpcGetErc20TokenResponse,
  GrpcGetIncidentCollectionResponse,
  GrpcGetSettingQuery,
  GrpcGetSettingResponse,
  GrpcGetWalletQuery,
  GrpcGetWalletResponse,
  GrpcGetWithdrawResponse,
  GrpcPostIncidentCollectionResponse,
  GrpcUpdateSettingBody,
  GrpcUpdateSettingResponse,
  UpdateBlacklistAddressQuery,
  BlacklistAddressDto,
  GrpcAddListBlacklistQuery,
  GrpcGetBlacklistAddressResponse,
  GrpcUpdateBlacklistAddressResponse,
  GrpcUpdateIgnoreBlacklistQuery,
  GrpcGetBlacklistUserResponse,
  GrpcAddListBlacklistUserQuery,
  UpdateBlacklistUserQuery,
  GrpcUpdateIgnoreBlacklistUserQuery,
  GrpcUpdateBlacklistUserResponse,
  BlacklistUserDto,
  GrpcRemoveBlacklistAddressResponse,
  GrpcRemoveBlacklistUserResponse,
  GrpcGetChainNetworkResponse,
  BaseFilterTransactionQuery,
  CreateManualDepositDto,
  GrpcRetryDepositResponse,
  GrpcCreateManualDepositResponse,
  GrpcExportResponse,
  RetryFailedWithdrawBaseDto,
  GrpcRetryFailedWithdrawResponse,
  GrpcStopWithdrawResponse,
  GrpcWithdrawByIdResponse,
  GrpcDepositByIdResponse,
  GrpcGetTrezorWalletResponse,
  FilterTrezorWalletQuery,
  CreateTrezorTransactionParams,
} from '@lib/grpc-client/hot-wallet/dtos'
import { plainToInstance } from 'class-transformer'
import { ApiHotWalletService } from './api-hot-wallet.service'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import {
  CreateBceManualDepositDto,
  GrpcCreateBceManualDepositResponse,
} from '@lib/grpc-client/wallet-bce-backend/dtos/wallet-bce-backend.dto'

@ApiTags('Hot Wallet')
@Controller('api-hot-wallet')
export class ApiHotWalletController {
  constructor(
    private readonly hotWalletService: HotWalletService,
    private readonly apiHotWalletService: ApiHotWalletService,
  ) {}

  /**
   * * Deposit
   */
  @Get('deposit')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get deposit transaction data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetDepositResponse })
  async getDeposit(@Query() query: BaseFilterTransactionQuery) {
    return this.hotWalletService.getDeposit(query)
  }

  /**
   * * Withdraw
   */
  @Get('withdraw')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get withdraw transaction data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetWithdrawResponse })
  async getWithdraw(@Query() query: BaseFilterTransactionQuery) {
    return this.hotWalletService.getWithdraw(query)
  }

  /**
   * * Wallet
   */
  @Get('wallet')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get wallet transaction data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetWalletResponse })
  async getWallet(@Query() query: GrpcGetWalletQuery) {
    return this.hotWalletService.getWallet(query)
  }

  /**
   * * Incident
   */
  @Get('incident')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get incident data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetIncidentCollectionResponse })
  async getIncidentCollection(
    @Query() query: GrpcFilterIncidentCollectionQuery,
  ) {
    return this.hotWalletService.getIncidentCollection(query)
  }
  @Post('incident')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get incident data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcPostIncidentCollectionResponse })
  async postIncidentCollection(
    @Query() query: GrpcFilterIncidentCollectionQuery,
  ) {
    return this.hotWalletService.postIncidentCollection(query)
  }

  /**
   * * Setting
   */
  @Get('setting')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get setting data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetSettingResponse })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSetting(@Query() query: GrpcGetSettingQuery) {
    return this.hotWalletService.getSetting(query)
  }

  @Patch('setting')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update setting data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUpdateSettingResponse })
  @ApiBody({ type: GrpcUpdateSettingBody })
  async updateSetting(@Body() body: GrpcUpdateSettingBody) {
    return this.hotWalletService.updateSetting(body)
  }

  /**
   * * Erc20 Token
   */
  @Get('erc20-token')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get Erc20 tokens data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetErc20TokenResponse })
  async getErc20Token() {
    return this.hotWalletService.getErc20Token()
  }

  /**
   * * Chain network
   */
  @Get('chain-network')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list chain network data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetChainNetworkResponse })
  async getChainNetwork() {
    return this.hotWalletService.getChainNetwork()
  }

  /**
   * * Blacklist
   */
  @Get('blacklist-address')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list blacklist address' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetBlacklistAddressResponse })
  async getListBlacklist(@Query() query: BaseFilterQuery) {
    return this.hotWalletService.getListBlacklist(query)
  }

  @Post('blacklist-address')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add list blacklist address' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetBlacklistAddressResponse })
  @ApiBody({ type: GrpcAddListBlacklistQuery })
  async addListBlacklist(@Body() body: GrpcAddListBlacklistQuery) {
    body.data = plainToInstance(UpdateBlacklistAddressQuery, body.data)
    return this.hotWalletService.addListBlacklist(body)
  }

  @Patch('blacklist-address/ignore')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update ignore blacklist address' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUpdateBlacklistAddressResponse })
  @ApiBody({ type: GrpcUpdateIgnoreBlacklistQuery })
  async updateIgnoreBlacklist(@Body() body: GrpcUpdateIgnoreBlacklistQuery) {
    return this.hotWalletService.updateIgnoreBlacklist(body)
  }

  @Patch('blacklist-address')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update blacklist address' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUpdateBlacklistAddressResponse })
  @ApiBody({ type: BlacklistAddressDto })
  async updateBlacklist(@Body() body: UpdateBlacklistAddressQuery) {
    return this.hotWalletService.updateBlacklist(body)
  }

  @Post('blacklist-address/:id/remove')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove blacklist address' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcRemoveBlacklistAddressResponse })
  async removeBlacklist(@Param() param: { id: number }) {
    return this.hotWalletService.removeBlacklist(param)
  }

  /**
   * * Blacklist user
   */
  @Get('blacklist-user')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list blacklist user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetBlacklistUserResponse })
  async getListBlacklistUser(@Query() query: BaseFilterQuery) {
    return this.apiHotWalletService.getListBlacklistUser(query)
  }

  @Get('blacklist-user/search-email')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Search list blacklist user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetBlacklistUserResponse })
  async searchListBlacklistUser(@Query() query: BaseFilterQuery) {
    return this.apiHotWalletService.searchListBlacklistUserEmail(query)
  }

  @Post('blacklist-user')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add list blacklist user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetBlacklistUserResponse })
  @ApiBody({ type: GrpcAddListBlacklistUserQuery })
  async addListBlacklistUser(@Body() body: GrpcAddListBlacklistUserQuery) {
    body.data = plainToInstance(UpdateBlacklistUserQuery, body.data)
    return this.hotWalletService.addListBlacklistUser(body)
  }

  @Patch('blacklist-user/ignore')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update ignore blacklist user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUpdateBlacklistUserResponse })
  @ApiBody({ type: GrpcUpdateIgnoreBlacklistUserQuery })
  async updateIgnoreBlacklistUser(
    @Body() body: GrpcUpdateIgnoreBlacklistUserQuery,
  ) {
    return this.hotWalletService.updateIgnoreBlacklistUser(body)
  }

  @Patch('blacklist-user')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update blacklist user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUpdateBlacklistUserResponse })
  @ApiBody({ type: BlacklistUserDto })
  async updateBlacklistUser(@Body() body: UpdateBlacklistUserQuery) {
    return this.hotWalletService.updateBlacklistUser(body)
  }

  @Post('blacklist-user/:id/remove')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove blacklist user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcRemoveBlacklistUserResponse })
  async removeBlacklistUser(@Param('id') id: number) {
    return this.hotWalletService.removeBlacklistUser({
      id,
    })
  }

  @Post('deposit/manual-transaction')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create deposit transaction by manual function' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateManualDepositDto })
  @ApiResponse({ type: GrpcCreateManualDepositResponse })
  async createManualDepositTransaction(
    @Body() body: CreateManualDepositDto,
    @Req() { accessTokenInfo }: IRequestWithAccessToken,
  ) {
    return this.hotWalletService.createManualDeposit({
      ...body,
      adminId: +accessTokenInfo.uid,
    })
  }

  @Post('deposit/bce-manual-transaction')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create deposit transaction by bce manual function',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateBceManualDepositDto })
  @ApiResponse({ type: GrpcCreateBceManualDepositResponse })
  async createBceManualDepositTransaction(
    @Body() body: CreateBceManualDepositDto,
  ) {
    return this.apiHotWalletService.createBceManualDeposit(body)
  }

  @Post('deposit/:id/retry-transaction')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retry a deposit transaction' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: GrpcRetryDepositResponse })
  async retryDepositTransaction(
    @Param() { id }: { id: number },
    @Req() { accessTokenInfo }: IRequestWithAccessToken,
  ) {
    return this.hotWalletService.retryManualDeposit({
      transactionId: id,
      adminId: +accessTokenInfo.uid,
    })
  }

  @Post('deposit/export')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Export deposit transaction by filter' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcExportResponse })
  async exportDepositTransactions(@Query() query: BaseFilterTransactionQuery) {
    return this.hotWalletService.exportDepositTransactions(query)
  }

  @Post('withdraw/export')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Export withdraw transaction by filter' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcExportResponse })
  async exportWithdrawTransactions(@Query() query: BaseFilterTransactionQuery) {
    return this.hotWalletService.exportWithdrawTransactions(query)
  }

  @Post('withdraw/:id/retry')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retry a failed withdraw transaction' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  @ApiBody({ type: RetryFailedWithdrawBaseDto })
  @ApiResponse({ type: GrpcRetryFailedWithdrawResponse })
  async retryWithdrawTransaction(
    @Param() { id }: { id: number },
    @Body() body: RetryFailedWithdrawBaseDto,
    @Req() { accessTokenInfo }: IRequestWithAccessToken,
  ) {
    return this.hotWalletService.retryFailedWithdraw({
      id: +id,
      ...body,
      adminId: +accessTokenInfo.uid,
    })
  }

  @Post('withdraw/:id/stop')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Stop a processing withdraw transaction' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: GrpcStopWithdrawResponse })
  async stopWithdrawTransaction(
    @Param() { id }: { id: number },
    @Req() { accessTokenInfo }: IRequestWithAccessToken,
  ) {
    return this.hotWalletService.stopWithdrawTransaction({
      transactionId: +id,
      adminId: +accessTokenInfo.uid,
    })
  }

  @Get('withdraw/:id')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get detail of withdraw transaction by ID' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: GrpcWithdrawByIdResponse })
  getDetailWithdraw(@Param() { id }: { id: number }) {
    return this.apiHotWalletService.getWithdrawById(+id)
  }

  @Get('deposit/:id')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get detail of deposit transaction by ID' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: GrpcDepositByIdResponse })
  getDetailDeposit(@Param() { id }: { id: number }) {
    return this.apiHotWalletService.getDepositById(+id)
  }

  @Get('trezor-wallet')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get List trezor wallets' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetTrezorWalletResponse })
  getTrezorWallet(@Query() query: FilterTrezorWalletQuery) {
    return this.hotWalletService.getTrezorWallet(query)
  }

  @Get('trezor-collector-address')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get List trezor collector address' })
  @HttpCode(HttpStatus.OK)
  getTrezorCollectorAddress() {
    return this.hotWalletService.getTrezorCollectorAddress()
  }

  @Post('trezor-transaction')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Submit collected transaction to wallet service' })
  @HttpCode(HttpStatus.OK)
  createTrezorTransaction(@Body() params: CreateTrezorTransactionParams) {
    return this.hotWalletService.createTrezorTransaction(params)
  }
}
