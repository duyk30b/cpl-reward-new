import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  ApprovePayoutRequestDTO,
  ConfirmBankTransferPayoutRequestDTO,
  ListPayoutsRequestDTO,
  PayoutDetailRequestDTO,
  RejectBankTransferPayoutRequestDTO,
  RejectPayoutRequestDTO,
} from './payment.dto'
import { PaymentService } from './payment.service'

@ApiTags('MT5')
@Controller('mt5/payment')
export class PaymentController {
  constructor(private readonly _apiPaymentService: PaymentService) {}

  // payout

  @Get('/payouts')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYOUT_READ)
  @ApiBearerAuth('access-token')
  async getPayoutRequests(@Query() request: ListPayoutsRequestDTO) {
    return await this._apiPaymentService.getPayoutRequests(request)
  }

  @Get('/payout/:payout_id')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYOUT_READ)
  @ApiBearerAuth('access-token')
  async getPayoutDetail(@Param() request: PayoutDetailRequestDTO) {
    return await this._apiPaymentService.getPayoutDetail(request)
  }

  @Post('/payout/approve')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYOUT_ADMIN_APPROVE_REQUEST)
  @ApiBearerAuth('access-token')
  async approvePayout(@Body() approvePayoutRequest: ApprovePayoutRequestDTO) {
    return await this._apiPaymentService.approvePayout(approvePayoutRequest)
  }

  @Post('/payout/reject')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYOUT_ADMIN_APPROVE_REQUEST)
  @ApiBearerAuth('access-token')
  async rejectPayout(@Body() rejectPayoutRequest: RejectPayoutRequestDTO) {
    return await this._apiPaymentService.rejectPayout(rejectPayoutRequest)
  }

  @Post('/payout/confirmBankTransfer')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYOUT_ADMIN_APPROVE_REQUEST)
  @ApiBearerAuth('access-token')
  async confirmBankTransfer(
    @Body()
    confirmBankTransferPayoutRequest: ConfirmBankTransferPayoutRequestDTO,
  ) {
    return await this._apiPaymentService.confirmBankTransferPayout(
      confirmBankTransferPayoutRequest,
    )
  }

  @Post('/payout/rejectBankTransfer')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYOUT_ADMIN_APPROVE_REQUEST)
  @ApiBearerAuth('access-token')
  async rejectBankTransfer(
    @Body()
    confirmBankTransferPayoutRequest: RejectBankTransferPayoutRequestDTO,
  ) {
    return await this._apiPaymentService.rejectBankTransferPayout(
      confirmBankTransferPayoutRequest,
    )
  }

  // payin

  @Get('/payins')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYIN_READ)
  @ApiBearerAuth('access-token')
  async getPayinRequests(@Query() request: ListPayoutsRequestDTO) {
    return await this._apiPaymentService.getPayinRequests(request)
  }

  @Get('/payin/:payout_id')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYIN_READ)
  @ApiBearerAuth('access-token')
  async getPayinDetail(@Param() request: PayoutDetailRequestDTO) {
    return await this._apiPaymentService.getPayinDetail(request)
  }

  @Post('/payin/approve')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYIN_ADMIN_APPROVE_REQUEST)
  @ApiBearerAuth('access-token')
  async approvePayin(@Body() request: ApprovePayoutRequestDTO) {
    return await this._apiPaymentService.approvePayin(request)
  }

  @Post('/payin/reject')
  @CheckPermission(Permission.MT5_PAYMENT_ECHELON_PAYIN_ADMIN_APPROVE_REQUEST)
  @ApiBearerAuth('access-token')
  async rejectPayin(@Body() request: RejectPayoutRequestDTO) {
    return await this._apiPaymentService.rejectPayin(request)
  }
}
