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
