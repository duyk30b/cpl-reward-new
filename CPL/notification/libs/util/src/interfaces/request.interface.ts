import { Request } from 'express'
export interface IRequestWithToken extends Request {
  tokenInfo: {
    userId: string
    deviceId: string
  }
}
