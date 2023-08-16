import { AdminService } from '@lib/admin'
import { AccessTokenService } from '@lib/authorization'
import { BusinessException, TokenError } from '@lib/util'
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'

@Injectable()
export class ValidateAccessTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly adminService: AdminService,
  ) {}

  async use(req: IRequestWithAccessToken, res: Response, next: () => void) {
    const authorization = req.header('Authorization') || ''
    const accessToken = authorization.split(' ')[1]
    let decoded: any
    if (process.env.NODE_ENV === 'local' && process.env.DECODE_TOKEN) {
      decoded = JSON.parse(process.env.DECODE_TOKEN)
    } else {
      decoded = this.accessTokenService.verify(accessToken)
    }

    const { uid, app_id: appId, scopes, iat: tokenCreatedTime } = decoded
    const lastLogoutTime = await this.adminService.getLastLogoutTime(uid)

    // tokenCreatedTime dùng đơn vị s còn lastLogoutTime là ms
    if ((tokenCreatedTime + 1) * 1000 < lastLogoutTime) {
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
    }
    req.accessTokenInfo = { uid, appId, scopes }

    next()
  }
}
