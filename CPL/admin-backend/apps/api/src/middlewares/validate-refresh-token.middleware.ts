import { Injectable, NestMiddleware } from '@nestjs/common'
import { RefreshTokenService } from '@lib/authorization'
import { IRequestWithRefreshToken } from '../interfaces/request-with-refresh-token'

@Injectable()
export class ValidateRefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  async use(req: IRequestWithRefreshToken, res: Response, next: () => void) {
    const refreshToken = req.body.refresh_token

    const decoded = this.refreshTokenService.verify(refreshToken)
    const { uid, app_id: appId, scopes } = decoded

    req.refreshTokenInfo = { uid, appId, scopes }
    next()
  }
}
