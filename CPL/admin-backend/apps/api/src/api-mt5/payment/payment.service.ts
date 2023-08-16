import {
  GrpcPaymentService,
  IConfirmBankTransferPayoutRequest,
} from '@lib/grpc-client/mt5/payment'
import { Injectable } from '@nestjs/common'
import {
  ApprovePayoutRequestDTO,
  ListPayoutsRequestDTO,
  RejectPayoutRequestDTO,
} from './payment.dto'

@Injectable()
export class PaymentService {
  /**
   * constructor
   * @param boTradingService
   */
  constructor(private readonly _mt5PaymentService: GrpcPaymentService) {}

  /**
   * findAll
   * @param listNewsDto
   * @returns
   */
  async getPayoutRequests(requestDTO: ListPayoutsRequestDTO) {
    const data = await this._mt5PaymentService.getPayoutRequests(requestDTO)
    return data.data
  }

  /**
   * findOneById
   * @param payoutId
   * @returns
   */
  async getPayoutDetail(payoutId) {
    return await this._mt5PaymentService.getPayoutDetail(payoutId)
  }

  async approvePayout(approvePayoutRequest: ApprovePayoutRequestDTO) {
    return await this._mt5PaymentService.approvePayout(approvePayoutRequest)
  }

  async rejectPayout(rejectPayoutRequest: RejectPayoutRequestDTO) {
    return await this._mt5PaymentService.rejectPayout(rejectPayoutRequest)
  }

  async confirmBankTransferPayout(
    confirmBankTransferRequest: IConfirmBankTransferPayoutRequest,
  ) {
    return await this._mt5PaymentService.confirmBankTransferPayout(
      confirmBankTransferRequest,
    )
  }

  async rejectBankTransferPayout(
    confirmBankTransferRequest: IConfirmBankTransferPayoutRequest,
  ) {
    return await this._mt5PaymentService.confirmBankTransferPayout(
      confirmBankTransferRequest,
    )
  }

  /**
   * findAll
   * @param listNewsDto
   * @returns
   */
  async getPayinRequests(requestDTO: ListPayoutsRequestDTO) {
    const data = await this._mt5PaymentService.getPayinRequests(requestDTO)
    return data.data
  }

  /**
   * findOneById
   * @param payinId
   * @returns
   */
  async getPayinDetail(payinId) {
    return await this._mt5PaymentService.getPayinDetail(payinId)
  }

  async approvePayin(approvePayoutRequest: ApprovePayoutRequestDTO) {
    return await this._mt5PaymentService.approvePayin(approvePayoutRequest)
  }

  async rejectPayin(rejectPayoutRequest: RejectPayoutRequestDTO) {
    return await this._mt5PaymentService.rejectPayin(rejectPayoutRequest)
  }
}
