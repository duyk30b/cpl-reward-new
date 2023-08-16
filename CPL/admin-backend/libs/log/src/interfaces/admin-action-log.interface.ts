export interface IRequestAdminActionLog {
  adminId: string
  ip?: string
  endpoint?: string
  method?: string
  request?: string
  response?: string
  statusCode?: number
}

export interface IResponseAdminActionLog {
  adminId: string
  response?: string
  statusCode?: number
  timeProcessed?: number
}
