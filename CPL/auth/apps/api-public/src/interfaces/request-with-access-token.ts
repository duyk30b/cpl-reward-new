import { IAccessTokenPayload } from '@lib/authorization/interfaces/access-token-payload.interface'
import { Request } from 'express'
export interface IRequestWithAccessToken extends Request {
  accessTokenInfo: IAccessTokenPayload
}
