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
  errorCode?: number
}

export interface IBaseFilter {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IResponseWithPagination<T> {
  data: T[]
  pagination: IPaginationMeta
}

export interface IGrpcResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface IDataById {
  id: string
}
