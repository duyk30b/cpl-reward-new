import { FixedNumber } from '@ethersproject/bignumber'

export interface BalanceFileInfo {
  id: number
  email: string
  currency: string
  amount: string
  status?: string
  note?: string
}

export interface BalanceTransaction {
  user_id: string
  currency: string
  amount: string
}

export interface AvailableAmountFile {
  is_available: boolean
  data: Map<string, AvailableAmountData>
}

export interface AvaildAmountLine {
  amount: FixedNumber
  is_unlimited: boolean
}

export interface AvailableAmountData {
  amount: string
  max_file_amount: string
  remain_amount: string
  is_unlimited: boolean
  is_avalid_amount: boolean
}

export interface UploadFileInfo {
  file: Buffer
  admin_id: string
  file_name: string
}

export interface ImportBalanceReponse {
  status: boolean
  type?: string
  data?: any
}

export interface ConfirmImportBalanceReponse {
  status: boolean
  type?: string
  data?: any
}

export interface CancelImportBalanceReponse {
  status: boolean
  type?: string
  data?: any
}
