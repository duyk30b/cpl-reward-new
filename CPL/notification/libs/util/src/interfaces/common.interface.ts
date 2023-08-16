import { SortType } from '../variables'

export interface IBaseFilter {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: SortType
}

export interface IDataById {
  id: string
}
