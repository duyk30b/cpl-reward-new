export interface Currency {
  coin: string
  name: string
}

export interface BalanceChangeHistoryRequest {
  search_text?: string

  currency?: string

  transaction_type: string

  page?: number

  limit?: number

  sort?: string

  get_all?: boolean

  sort_type?: string

  start_date: number

  end_date: number
}

export interface BalanceTransaction {
  id: number
  currency: string
  email: string
  type: string
  amount: string
  createdAt: number
}

export interface BalanceChangeHistoryResponse {
  status_code: number
  data: {
    data: BalanceTransaction[]
    paginate?: {
      page: number
      size: number
      total: number
    }
  }
}
