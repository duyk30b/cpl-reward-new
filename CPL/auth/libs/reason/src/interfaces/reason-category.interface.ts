import { JsonNameInterface } from './json-name.interface'
import { ReasonCategoryTypeEnum } from '../enums/reason-category-type.enum'
import { IReason } from './reason.interface'
import {
  IBaseResponse,
  IPaginationMeta,
} from '@lib/grpc-client/grpc-client.interface'

export interface IReasonCategory {
  id: string

  name: JsonNameInterface

  type: ReasonCategoryTypeEnum

  reasons?: IReason[]
}

export interface ICreateReasonCategory {
  name: JsonNameInterface

  type: ReasonCategoryTypeEnum
}

export interface IReasonCategoryList {
  data: IReasonCategory[]

  pagination: IPaginationMeta
}

export interface IReasonCategoryFilter {
  page?: number

  limit?: number

  searchField?: string

  searchText?: string

  sort?: string

  sortType?: 'ASC' | 'DESC'

  type?: number
}

export interface IReasonCategoryId {
  id: string
}

export interface IBaseReasonCategoryResponse extends IBaseResponse {
  data?: IReasonCategory
}
