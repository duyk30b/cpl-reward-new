import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { BusinessException } from '@lib/util'
import { TokenError } from '@lib/util'
import { AccessTokenService } from '@lib/authorization'
import { BlacklistUserService } from '@lib/blacklist'
import { DeviceService } from '@lib/device'
import { UserService } from '@lib/user'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'

@Injectable()
export class ValidateAccessTokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ValidateAccessTokenMiddleware.name)
  constructor(
    private readonly devicesService: DeviceService,
    private readonly accessTokenService: AccessTokenService,
    private readonly userService: UserService,
    private readonly blacklistUserService: BlacklistUserService,
  ) {}

  async use(req: IRequestWithAccessToken, res: Response, next: () => void) {
    const requestDeviceHash = req.header('device_hash')
    const authorization = req.header('Authorization') || ''
    const accessToken = authorization.split(' ')[1]

    const decoded = this.accessTokenService.verify(accessToken)

    const {
      uid: userId,
      app_id: appId,
      device: deviceId,
      scopes,
      iat: tokenCreatedTime,
    } = decoded

    const device = await this.devicesService.getDeviceById(deviceId)
    if (!device) {
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
    }

    if (device.deviceHash != requestDeviceHash) {
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
    }

    const lastLogoutTime = await this.userService.getLastLogoutTime(
      userId,
      deviceId,
    )

    // tokenCreatedTime dùng đơn vị s còn lastLogoutTime là ms
    if ((tokenCreatedTime + 1) * 1000 < lastLogoutTime) {
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
    }

    const userBlacklisted =
      await this.blacklistUserService.checkUserBlacklisted(userId)
    if (userBlacklisted)
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)

    // this.logger.log(`User active: ${userId}`)
    req.accessTokenInfo = { userId, appId, deviceId, scopes }

    next()
  }
}
