import { JsonNameInterface } from './json-name.interface'
import { ReasonCategoryTypeEnum } from '@lib/grpc-client/reason/reason-category.enum'
import { IReason } from '@lib/grpc-client/reason/interfaces/reason.interface'
import { IBaseFilter } from '@lib/grpc-client'

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

export interface IPagination {
  page: number
  size: number
  total: number
}

export interface IReasonCategoryList {
  data: IReasonCategory[]
  pagination: IPagination
}

export interface IReasonCategoryId {
  id: string
}

export interface IBaseReasonCategoryResponse {
  success: boolean
  message?: string
  data?: IReasonCategory
}

export interface IReasonCategoryFilter extends IBaseFilter {
  type?: number
}

export interface ILanguageResponse {
  data: string[]
}
