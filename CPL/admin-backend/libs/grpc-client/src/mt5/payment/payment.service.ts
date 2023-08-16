import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { ParseResponseGrpcMT5 } from '../../grpc-client.helper'
import {
  ListPayinsResponseDTO,
  ListPayoutsResponseDTO,
  PayinDetailDTO,
  PayinDetailResponseDTO,
  PayinDTO,
  PayinStatusResponseDTO,
  PayoutDetailDTO,
  PayoutDetailResponseDTO,
  PayoutDTO,
  PayoutStatusResponseDTO,
} from './payment.dto'
import {
  IApprovePayoutRequest,
  IListPayoutsRequest,
  IGrpcPaymentService,
  IPayoutDetailRequest,
  IRejectPayoutRequest,
  IConfirmBankTransferPayoutRequest,
  IRejectBankTransferPayoutRequest,
} from './payment.interface'

@Injectable()
export class GrpcPaymentService {
  private _paymentService: IGrpcPaymentService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('MT5_PAYMENT_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this._paymentService =
      this.client.getService<IGrpcPaymentService>('PaymentEchelonpay')
  }

  /**
   * getPayoutDetail
   * @param request
   * @returns
   */
  async getPayoutDetail(
    request: IPayoutDetailRequest,
  ): Promise<PayoutDetailResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.getPayoutDetail(request),
    )
    return ParseResponseGrpcMT5<PayoutDetailResponseDTO>(
      PayoutDetailDTO,
      result,
    )
  }

  /**
   * getPayoutRequests
   * @param request
   * @returns
   */
  async getPayoutRequests(
    request: IListPayoutsRequest,
  ): Promise<ListPayoutsResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.getPayoutRequests(request),
    )

    return ParseResponseGrpcMT5<ListPayoutsResponseDTO>(PayoutDTO, result)
  }

  /**
   * approvePayout
   * @param request
   * @returns
   */
  async approvePayout(
    request: IApprovePayoutRequest,
  ): Promise<PayoutStatusResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.approvePayout(request),
    )

    return ParseResponseGrpcMT5<PayoutStatusResponseDTO>(
      PayoutStatusResponseDTO,
      result,
    )
  }

  /**
   * rejectPayout
   * @param request
   * @returns
   */
  async rejectPayout(
    request: IRejectPayoutRequest,
  ): Promise<PayoutStatusResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.rejectPayout(request),
    )

    return ParseResponseGrpcMT5<PayoutStatusResponseDTO>(
      PayoutStatusResponseDTO,
      result,
    )
  }

  /**
   * confirmBankTransferPayout
   * @param request
   * @returns
   */
  async confirmBankTransferPayout(
    request: IConfirmBankTransferPayoutRequest,
  ): Promise<PayoutStatusResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.confirmBankTransferPayout(request),
    )

    return ParseResponseGrpcMT5<PayoutStatusResponseDTO>(
      PayoutStatusResponseDTO,
      result,
    )
  }

  /**
   * rejectBankTransferPayout
   * @param request
   * @returns
   */
  async rejectBankTransferPayout(
    request: IRejectBankTransferPayoutRequest,
  ): Promise<PayoutStatusResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.rejectBankTransferPayout(request),
    )

    return ParseResponseGrpcMT5<PayoutStatusResponseDTO>(
      PayoutStatusResponseDTO,
      result,
    )
  }

  /**
   * getPayinDetail
   * @param request
   * @returns
   */
  async getPayinDetail(
    request: IPayoutDetailRequest,
  ): Promise<PayinDetailResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.getPayinDetail(request),
    )
    return ParseResponseGrpcMT5<PayinDetailResponseDTO>(PayinDetailDTO, result)
  }

  /**
   * getPayinRequests
   * @param request
   * @returns
   */
  async getPayinRequests(
    request: IListPayoutsRequest,
  ): Promise<ListPayinsResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.getPayinRequests(request),
    )

    return ParseResponseGrpcMT5<ListPayinsResponseDTO>(PayinDTO, result)
  }

  /**
   * approvePayin
   * @param request
   * @returns
   */
  async approvePayin(
    request: IApprovePayoutRequest,
  ): Promise<PayinStatusResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.approvePayin(request),
    )

    return ParseResponseGrpcMT5<PayinStatusResponseDTO>(
      PayinStatusResponseDTO,
      result,
    )
  }

  /**
   * rejectPayin
   * @param request
   * @returns
   */
  async rejectPayin(
    request: IRejectPayoutRequest,
  ): Promise<PayinStatusResponseDTO> {
    const result = await lastValueFrom(
      this._paymentService.rejectPayin(request),
    )

    return ParseResponseGrpcMT5<PayinStatusResponseDTO>(
      PayinStatusResponseDTO,
      result,
    )
  }
}
