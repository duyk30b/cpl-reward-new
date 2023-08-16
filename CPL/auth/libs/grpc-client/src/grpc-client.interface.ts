export interface IPaginationMeta {
  page: number
  total?: number
  size: number
}

export interface IGetResponse<T> {
  data: T
}

export interface IPostResponse {
  success: boolean
  message?: string
  data?: string
}

export interface IBaseFilter {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IBaseResponse {
  success: boolean
  message?: string
  data?: any
}
