import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { WalletBceAdminService } from '@lib/grpc-client/wallet-bce-admin/services'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'

import { ApiWalletBceAdminService } from './api-wallet-bce-admin.service'
import {
  BceApproveTransactionRequest,
  BceDepositHistoryRequest,
  BceDownloadFileExportRequest,
  BceExportFileRequest,
  BceExternalWithdrawRequest,
  BceGetUserBalanceRequest,
  BceRegistrationRemittanceRequest,
  BceTransactionDetailRequest,
  BceWithdrawalSecurityRequest,
  BceWithdrawHistoryRequest,
  GlobalUsdtFeeSettingParams,
  GrpcBceApproveTransactionResponse,
  GrpcBceBaseWithdrawalSecurityResponse,
  GrpcBceBOProfitResponse,
  GrpcBceBOTotalRecordResponse,
  GrpcBceConfigTransactionApprovalResponse,
  GrpcBceExportFileResponse,
  GrpcBceExternalWithdrawResponse,
  GrpcBceTransactionDetailResponse,
  GrpcBceUserBalanceResponse,
  GrpcDepositHistoryResponse,
  GrpcUpdateWithdrawalSettingResponse,
  GrpcWithdrawalSettingPaginationResponse,
  GrpcWithdrawHistoryResponse,
  SettingPaginationRequest,
  UpdateWithdrawalSettingBodyExample,
  UpdateWithdrawalSettingParams,
} from '@lib/grpc-client/wallet-bce-admin/dtos/wallet-bce-admin.dto'

@ApiTags('Wallet Bce Admin')
@Controller('api-wallet-bce-admin')
export class ApiWalletBceAdminController {
  constructor(
    private readonly walletBceAdminService: WalletBceAdminService,
    private readonly apiWalletBceAdminService: ApiWalletBceAdminService,
  ) {}

  /**
   * * History
   */
  @Get('deposit-history')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get deposit history data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcDepositHistoryResponse })
  async getDepositHistories(@Query() query: BceDepositHistoryRequest) {
    return this.walletBceAdminService.depositHistories(query)
  }

  @Get('deposit-history/export')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Export deposit history data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceExportFileResponse })
  async depositHistoryExport(@Query() query: BceDepositHistoryRequest) {
    return this.walletBceAdminService.depositHistoryExport(query)
  }

  @Get('withdraw-history')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get withdraw history data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcWithdrawHistoryResponse })
  async getWithdrawHistories(@Query() query: BceWithdrawHistoryRequest) {
    return this.walletBceAdminService.withdrawHistories(query)
  }

  @Get('withdraw-history/export')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Export withdraw history data' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceExportFileResponse })
  async withdrawHistoryExport(@Query() query: BceWithdrawHistoryRequest) {
    return this.walletBceAdminService.withdrawHistoryExport(query)
  }

  @Get('file-export')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List file exported' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceExportFileResponse })
  async listExportFile(@Query() query: BceExportFileRequest) {
    return this.walletBceAdminService.listExportFile(query)
  }

  @Get('file-export/download')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Download file exported' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceExportFileResponse })
  async downloadExportFile(@Query() query: BceDownloadFileExportRequest) {
    return this.apiWalletBceAdminService.downloadFileExport(query)
  }

  @Get('transactions/external-withdraws')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List external withdraws' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceExternalWithdrawResponse })
  async getExternalWithdraw(@Query() query: BceExternalWithdrawRequest) {
    return this.walletBceAdminService.getExternalWithdraw(query)
  }

  @Get('transactions/external-withdraws/export')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Export list external withdraws' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceExportFileResponse })
  async exportWithdrawControl(@Query() query: BceExternalWithdrawRequest) {
    return this.walletBceAdminService.exportWithdrawControl(query)
  }

  @Get('transactions/detail')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get transaction detail' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceExternalWithdrawResponse })
  async getTransactionDetail(@Query() query: BceTransactionDetailRequest) {
    return this.apiWalletBceAdminService.getTransactionDetail(query)
  }

  @Post('transactions/approve')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Change transaction status' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceApproveTransactionResponse })
  async approveTransaction(@Body() body: BceApproveTransactionRequest) {
    return this.walletBceAdminService.approveTransaction(body)
  }

  @Post('transactions/registration-remittance')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Registration remittance transaction' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceTransactionDetailResponse })
  async registrationRemittance(@Body() body: BceRegistrationRemittanceRequest) {
    return this.walletBceAdminService.registrationRemittance(body)
  }

  @Get('bo/get-total-record')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get total record in BO Service' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceBOTotalRecordResponse })
  async getBoTotalRecord(@Query() query: BceWithdrawalSecurityRequest) {
    return this.walletBceAdminService.getBoTotalRecord(query)
  }

  @Get('bo/get-profit')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get total profit in BO Service' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceBOProfitResponse })
  async getBoProfit(@Query() query: BceWithdrawalSecurityRequest) {
    return this.walletBceAdminService.getBoProfit(query)
  }

  @Get('withdrawal-security/order-minutely-rating')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get order minutely rating of user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceBaseWithdrawalSecurityResponse })
  async getOrderMinutelyRating(@Query() query: BceWithdrawalSecurityRequest) {
    return this.walletBceAdminService.getOrderMinutelyRating(query)
  }

  @Get('withdrawal-security/order-daily-rating')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get order daily rating of user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceBaseWithdrawalSecurityResponse })
  async getOrderDailyRating(@Query() query: BceWithdrawalSecurityRequest) {
    return this.walletBceAdminService.getOrderDailyRating(query)
  }

  @Get('withdrawal-security/order-over-limit')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get order over limit of user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceBaseWithdrawalSecurityResponse })
  async getOrderOverLimit(@Query() query: BceWithdrawalSecurityRequest) {
    return this.walletBceAdminService.getOrderOverLimit(query)
  }

  @Get('withdrawal-security/user-balance')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get balance of user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceUserBalanceResponse })
  async getUserBalance(@Query() query: BceGetUserBalanceRequest) {
    return this.walletBceAdminService.getUserBalance(query)
  }

  @Get('withdrawal-security/manually-update-major-balance')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get manually update major balance of user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceBaseWithdrawalSecurityResponse })
  async getManuallyUpdateMajorBalance(
    @Query() query: BceWithdrawalSecurityRequest,
  ) {
    return this.walletBceAdminService.getManuallyUpdateMajorBalance(query)
  }

  @Get('withdrawal-security/dividend-code-duplicated')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get dividend code duplicated of user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceBaseWithdrawalSecurityResponse })
  async getDividendCodeDuplicated(
    @Query() query: BceWithdrawalSecurityRequest,
  ) {
    return this.walletBceAdminService.getDividendCodeDuplicated(query)
  }

  @Get('withdrawal-setting')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list withdrawal settings' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcWithdrawalSettingPaginationResponse })
  async getWithdrawalSettings(@Query() query: SettingPaginationRequest) {
    return this.walletBceAdminService.getWithdrawalSettings(query)
  }

  @Get('config-transaction-approval')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list config transaction approval' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceConfigTransactionApprovalResponse })
  async getConfigTransactionApproval() {
    return this.walletBceAdminService.getConfigTransactionApproval()
  }

  @Put('withdrawal-setting')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update withdrawal settings for coin' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUpdateWithdrawalSettingResponse })
  @ApiBody({
    schema: {
      type: 'object',
      example: UpdateWithdrawalSettingBodyExample,
    },
  })
  async updateWithdrawalSetting(@Body() params: UpdateWithdrawalSettingParams) {
    return this.walletBceAdminService.updateWithdrawalSettings(params)
  }

  @Get('admin')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list admin' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcWithdrawalSettingPaginationResponse })
  getListAdmin() {
    return this.apiWalletBceAdminService.getListAdmin()
  }

  @Patch('global-fee')
  @CheckPermission(Permission.WALLET_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update global USDT fee setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcWithdrawalSettingPaginationResponse })
  updateGlobalFeeSetting(@Body() params: GlobalUsdtFeeSettingParams) {
    return this.walletBceAdminService.updateGlobalUsdtFeeSetting(params)
  }

  @Get('global-setting')
  @CheckPermission(Permission.WALLET_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get global setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcBceConfigTransactionApprovalResponse })
  getGlobalSetting() {
    return this.walletBceAdminService.getGlobalUsdtFeeSetting()
  }
}
