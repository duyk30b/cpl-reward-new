import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'
import { IReason } from '@/interfaces/reason.interface'

export interface JsonNameInterface {
  [key: string]: string
}

export class IReasonCategory {
  id?: string
  name: JsonNameInterface
  type: ReasonCategoryTypeEnum
  reasons?: IReason[]

  get checked() {
    return (this.reasons || []).every((reason) => reason.checked)
  }

  set checked(value) {
    if (this.reasons) {
      this.reasons.forEach((reason) => {
        reason.checked = value
      })
    }
  }
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

export interface IReasonCategoryFilter {
  page?: number
  limit?: number
  search_field?: string
  search_text?: string
  sort?: string
  sort_type?: string
  type?: number
}
