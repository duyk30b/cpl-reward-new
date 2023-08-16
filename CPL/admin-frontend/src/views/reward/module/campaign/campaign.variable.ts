export enum CampaignType {
  DEFAULT = 0,
  DAILY = 3,
}

export interface PaginationCampaignRequest {
  page: number
  limit: number
  search_field?: string
  search_text?: string
  sort?: string
  sort_type?: 'ASC' | 'DESC' | ''
}

export interface PaginationCampaignResponse {
  data: Record<string, any>[]
  links: {
    first: string
    last: string
    next: string
    prev: string
  }
  pagination: {
    page: number
    size: number
    total: number
  }
  prices: { currency: string; price: string }[]
}
