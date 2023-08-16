export interface BalanceImportFileRowsRequest {
  size?: number
  page?: number
}

export interface BalanceImportFileSettingRequest {
  size?: number
  page?: number
  currency?: string
}

export interface UpdateBalanceImportFileSettingRequest {
  max_file_amount: string
  max_line_amount: string
  remain_amount: string
  currency: string
  is_unlimited: boolean
}

export interface UpdateBalanceImportFileSettingResponse {
  status?: number
  data?: {
    errors?: Error[]
  }
}

export interface Error {
  property: string
  msg: string
}

export interface BalanceImportSummaryResponse {
  data: {
    total_rows: number
    failed_rows: number
    succeed_rows: number
  }
}

export interface BalanceImportFileDetailResponse {
  data: BalanceImportFile
}

export interface ConfirmBalanceImportFileRequest {
  balance_type: string
}

export interface ConfirmBalanceImportFileResponse {
  status: number
  data: {
    status: boolean
  }
}

export interface CancelBalanceImportFileResponse {
  status: number
  data: {
    status: boolean
  }
}

export interface BalanceImportFileRowsResponse {
  data: {
    data: BalanceImportFileDetail[]
    paginate?: {
      page: number
      size: number
      total: number
    }
  }
}

export interface BalanceImportFileSettingResponse {
  data: {
    data: BalanceImportFileSetting[]
    paginate?: {
      page: number
      size: number
      total: number
    }
  }
}

export interface BalanceImportFileSetting {
  id: string
  max_file_amount: string
  max_line_amount: string
  remain_amount: string
  currency: string
  is_unlimited: boolean
}

export interface BalanceImportFileDetail {
  amount: string
  created_at: number
  currency: string
  email: string
  id: string
  import_file_id: string
  note: string
  row_index: 1
  status: 4
  updated_at: number
  user_id: string
}

export interface ListBalanceImportFileRequest {
  size?: number
  page?: number
}

export interface ListBalanceImportFileResponse {
  data: {
    data: BalanceImportFile[]
    paginate?: {
      page: number
      size: number
      total: number
    }
  }
}

export interface BalanceImportFile {
  admin_id: string
  created_at: number
  updated_at: number
  file_name: string
  status: number
  id: string
  total_rows: number
  failed_rows: number
  balance_type: string
}

export interface UploadFileResponse {
  status: number
  data: {
    status_code?: any
    message?: any
    data?: { fileId: string }
    errors?: { property: string; msg: string }[]
  }
}
