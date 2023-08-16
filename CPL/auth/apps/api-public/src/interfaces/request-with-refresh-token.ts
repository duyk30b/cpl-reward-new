import { IRefreshTokenPayload } from '@lib/authorization/interfaces/refresh-token-payload.interface'
import { Request } from 'express'
export interface IRequestWithRefreshToken extends Request {
  refreshTokenInfo: IRefreshTokenPayload
}
