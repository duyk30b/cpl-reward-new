export interface Currency {
  coin: string
  name: string
}

export interface DividendDate {
  date: string
  month: string
}

export interface Dividend {
  id: number
  status: string
}

export interface DividendAdvanced {
  estimate_distribute_amount: number
  estimate_user_balance: number
  has_user: boolean
  last_distributed_amount: number
  total_distributed_amount: number
  total_joined_user: number
}

export interface DividendCode {
  name: string
  code: string
  campaign_status: string
  status: string
  established_date: string
  email: string
  last_dividend_date: string
  distribute_type: string
}

export interface DividendHistory {
  name: string
  email: string
  amount: number
  usd_rate: string
  ending_balance: string
  dividend_rate: string
  target_amount: string
  dividend_date: string
  add_dividend_at: string
}

export interface DividendCampaign {
  name: string
  target_currency: string
  distributed_currency: string
  status: string
  accumulated_dividend: string
  total_target_balance: string
  dividend_calculated_mode: string
  dividend_rate: string
}
