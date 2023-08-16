import { Observable } from 'rxjs'
import { IGrpcResponse } from '../../grpc-client.interface'

export interface IGrpcPaymentService {
  // payout
  getPayoutRequests(request: IListPayoutsRequest): Observable<IGrpcResponse>
  getPayoutDetail(request: IPayoutDetailRequest): Observable<IGrpcResponse>
  approvePayout(request: IApprovePayoutRequest): Observable<IGrpcResponse>
  rejectPayout(request: IRejectPayoutRequest): Observable<IGrpcResponse>
  confirmBankTransferPayout(
    request: IConfirmBankTransferPayoutRequest,
  ): Observable<IGrpcResponse>
  rejectBankTransferPayout(
    request: IRejectBankTransferPayoutRequest,
  ): Observable<IGrpcResponse>

  // payin
  getPayinRequests(request: IListPayoutsRequest): Observable<IGrpcResponse>
  getPayinDetail(request: IPayoutDetailRequest): Observable<IGrpcResponse>
  approvePayin(request: IApprovePayoutRequest): Observable<IGrpcResponse>
  rejectPayin(request: IRejectPayoutRequest): Observable<IGrpcResponse>
}

// Request
export interface IListPayoutsRequest {
  page?: number
  size?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IPayoutDetailRequest {
  payoutId: string
}

export interface IApprovePayoutRequest {
  payoutId: string
  cplId: string
  mt5Login: string
  remark: string
  executor: string
}

export interface IRejectPayoutRequest {
  payoutId: string
  cplId: string
  mt5Login: string
  remark: string
  executor: string
}

export interface IConfirmBankTransferPayoutRequest {
  payoutId: string
  cplId: string
  mt5Login: string
  remark: string
  executor: string
}

export interface IRejectBankTransferPayoutRequest {
  payoutId: string
  cplId: string
  mt5Login: string
  remark: string
  executor: string
}

// Response
export interface IPayout {
  email: string
  amount: string
  paymentCode: string
  status: number
  createdDate: string
  updatedDate: string
  remark: string
  payoutId: string
  mt5Id: string
  totalAmount: string
}

export interface IPayoutStatus {
  payoutId: string
  status: number
}

export interface IPayoutDetail {
  payoutId?: string
  paymentCode?: string
  customerName?: string
  mt5Id?: string
  phoneNumber?: string
  email?: string
  amount?: string
  accountName?: string
  accountNumber?: string
  accountType?: string
  bankCode?: string
  bankName?: string
  bankBranch?: string
  bankCity?: string
  bankProvince?: string
  cplId?: string
  payoutStatus?: string
  totalAmount?: string
  reasonAdmin?: string
  reasonConfirmBankTransfer?: string
}

export interface IPayin {
  amount: string
  paymentCode: string
  status: number
  createdDate: string
  updatedDate: string
  remark: string
  payinId: string
  mt5Id: string
  totalAmount: string
  baseCurrency: string
  quote: string
  emailBitcastle: string
}

export interface IPayinStatus {
  payoutId: string
  status: number
}

export interface IPayinDetail {
  payinId?: string
  paymentCode?: string
  customerName?: string
  mt5Id?: string
  amount?: string
  cplId?: string
  payinStatus?: string
  totalAmount?: string
  reasonAdmin?: string
  baseCurrency: string
  quote: string
  emailBitcastle: string
}
