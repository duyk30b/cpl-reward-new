import {
  IReasonCategory,
  JsonNameInterface,
} from '@/interfaces/reason-category.interface'

export interface IReason {
  id: string
  name: JsonNameInterface
  category_id: string
  checked: boolean

  category?: IReasonCategory
}

export interface ICreateReason {
  name: JsonNameInterface
  category_id: string
}

export interface IReasonList {
  data: IReason[]
  pagination: IPagination
}

export interface IPagination {
  page: number
  size: number
  total: number
}

export interface IReasonFilter {
  page?: number
  limit?: number
  search_field?: string
  search_text?: string
  sort?: string
  sort_type?: string
  category_id?: number
}

export interface IBanUserReason {
  reason: JsonNameInterface
  category: JsonNameInterface
}

export interface IBanUser {
  note?: string
  reasons: IBanUserReason[]
}
