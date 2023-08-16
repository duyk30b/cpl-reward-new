import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import {
  IPayin,
  IPayinStatus,
  IPayout,
  IPayoutDetail,
  IPayoutStatus,
} from './payment.interface'

// payout
export class PayoutDTO {
  @Expose({ name: 'email' })
  email: string

  @Expose({ name: 'amount' })
  amount: string

  @Expose({ name: 'payment_code' })
  paymentCode: string

  @Expose({ name: 'status' })
  status: number

  @Expose({ name: 'created_date' })
  createdDate: string

  @Expose({ name: 'updated_date' })
  updatedDate: string

  @Expose({ name: 'remark' })
  remark: string

  @Expose({ name: 'payout_id' })
  payoutId: string

  @Expose({ name: 'total_amount' })
  totalAmount: string
}

export class PayoutDetailDTO {
  @Expose({ name: 'payout_id' })
  payoutId: string

  @Expose({ name: 'payment_code' })
  paymentCode: string

  @Expose({ name: 'customer_name' })
  customerName: string

  @Expose({ name: 'mt5_id' })
  mt5Id: string

  @Expose({ name: 'amount' })
  amount: string

  @Expose({ name: 'account_name' })
  accountName: string

  @Expose({ name: 'account_number' })
  accountNumber: string

  @Expose({ name: 'account_type' })
  accountType: string

  @Expose({ name: 'bank_code' })
  bankCode: string

  @Expose({ name: 'bank_name' })
  bankName: string

  @Expose({ name: 'bank_branch' })
  bankBranch: string

  @Expose({ name: 'bank_city' })
  bankCity: string

  @Expose({ name: 'bank_province' })
  bankProvince: string

  @Expose({ name: 'cpl_id' })
  cplId: string

  @Expose({ name: 'payout_status' })
  payoutStatus: string

  @Expose({ name: 'total_amount' })
  totalAmount: string

  @Expose({ name: 'reason_admin' })
  reasonAdmin: string

  @Expose({ name: 'reason_confirm_bank_transfer' })
  reasonConfirmBankTransfer: string
}

export class PayoutStatus {
  @Expose({ name: 'payout_id' })
  payoutId: string

  @Expose({ name: 'status' })
  status: number
}

export class BaseResponseDTO {
  @Expose()
  success: boolean

  @Expose()
  message: string
}

export class PayoutDetailResponseDTO extends BaseResponseDTO {
  data?: IPayoutDetail
}

export class ListPayoutsResponseDTO extends BaseResponseDTO {
  data?: {
    items: IPayout[]
    meta: IPaginationMeta
  }
}

export class PayoutStatusResponseDTO extends BaseResponseDTO {
  data?: IPayoutStatus
}

// payin
export class PayinDTO {
  @Expose({ name: 'amount' })
  amount: string

  @Expose({ name: 'payment_code' })
  paymentCode: string

  @Expose({ name: 'status' })
  status: number

  @Expose({ name: 'created_date' })
  createdDate: string

  @Expose({ name: 'updated_date' })
  updatedDate: string

  @Expose({ name: 'remark' })
  remark: string

  @Expose({ name: 'payin_id' })
  payinId: string

  @Expose({ name: 'mt5_id' })
  mt5_id: string

  @Expose({ name: 'total_amount' })
  total_amount: string

  @Expose({ name: 'email_bitcastle' })
  emailBitcastle: string
}

export class PayinStatus {
  @Expose({ name: 'payin_id' })
  payoutId: string

  @Expose({ name: 'status' })
  status: number
}

export class PayinDetailDTO {
  @Expose({ name: 'payin_id' })
  payinId: string

  @Expose({ name: 'mt5_id' })
  mt5Id: string

  @Expose({ name: 'email' })
  email: string

  @Expose({ name: 'amount' })
  amount: string

  @Expose({ name: 'cpl_id' })
  cplId: string

  @Expose({ name: 'payin_status' })
  payoutStatus: string

  @Expose({ name: 'total_amount' })
  totalAmount: string

  @Expose({ name: 'reason_admin' })
  reasonAdmin: string

  @Expose({ name: 'base_currency' })
  baseCurrency: string

  @Expose({ name: 'quote' })
  quote: string

  @Expose({ name: 'email_bitcastle' })
  emailBitcastle: string
}

export class PayinDetailResponseDTO extends BaseResponseDTO {
  data?: IPayoutDetail
}

export class ListPayinsResponseDTO extends BaseResponseDTO {
  data?: {
    items: IPayin[]
    meta: IPaginationMeta
  }
}

export class PayinStatusResponseDTO extends BaseResponseDTO {
  data?: IPayinStatus
}
