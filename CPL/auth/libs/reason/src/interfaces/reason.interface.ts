import { JsonNameInterface } from './json-name.interface'
import { IReasonCategory } from 'lib/reason/interfaces/reason-category.interface'
import {
  IBaseResponse,
  IPaginationMeta,
} from '@lib/grpc-client/grpc-client.interface'
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

export interface IReasonFilter {
  page?: number

  limit?: number

  searchField?: string

  searchText?: string

  sort?: string

  sortType?: 'ASC' | 'DESC'

  categoryId?: number
}

export interface IReasonId {
  id: string
}

export interface IBaseReasonResponse extends IBaseResponse {
  data?: IReason
}
