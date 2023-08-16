import { JsonNameInterface } from './json-name.interface'
import { IBaseFilter, IPaginationMeta } from '@lib/grpc-client'
import { IReasonCategory } from '@lib/grpc-client/reason/interfaces/reason-category.interface'

export interface IReason {
  id: string
  name: JsonNameInterface
  categoryId: string
  category?: IReasonCategory
}

export interface ICreateReason {
  name: JsonNameInterface
  categoryId: string
}

export interface IReasonList {
  data: IReason[]
  pagination: IPaginationMeta
}

export interface IReasonId {
  id: string
}

export interface IReasonFilter extends IBaseFilter {
  categoryId?: string
}

export interface IBaseReasonResponse {
  success: boolean
  message?: string
  data?: IReason
}
