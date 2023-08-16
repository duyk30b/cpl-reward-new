export interface IErrorResponse {
  status_code: number
  message: string
  errors: Array<any>
}

export interface IPostResponse {
  success: boolean
  message?: string
  data?: Record<string, any>
}

export type PostResponse = IPostResponse & IErrorResponse

export interface ICommonReponse<T> {
  config: any
  headers: any
  request: any
  status: number
  statusText: string
  data: {
    data: T
    message?: string
    time_stamp?: number | string
    total_count?: number
  }
}
