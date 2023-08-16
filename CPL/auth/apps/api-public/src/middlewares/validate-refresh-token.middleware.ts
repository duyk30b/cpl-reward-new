import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { BusinessException } from '@lib/util'
import { RefreshTokenService } from '@lib/authorization'
import { DeviceService } from '@lib/device'
import { TokenError } from '@lib/util'
import { UserService } from '@lib/user'
import { IRequestWithRefreshToken } from '../interfaces/request-with-refresh-token'
import { BlacklistUserService } from '@lib/blacklist'

@Injectable()
export class ValidateRefreshTokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ValidateRefreshTokenMiddleware.name)
  constructor(
    private readonly devicesService: DeviceService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersService: UserService,
    private readonly blacklistUserService: BlacklistUserService,
  ) {}

  async use(req: IRequestWithRefreshToken, res: Response, next: () => void) {
    const requestDeviceHash = req.header('device_hash')
    const refreshToken = req.body.refresh_token

    const decoded = this.refreshTokenService.verify(refreshToken)

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

    const lastLogoutTime = await this.usersService.getLastLogoutTime(
      userId,
      deviceId,
    )

    if ((tokenCreatedTime + 1) * 1000 < lastLogoutTime) {
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
    }

    const userBlacklisted =
      await this.blacklistUserService.checkUserBlacklisted(userId)
    if (userBlacklisted)
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)

    this.logger.log(`User active: ${userId}`)
    req.refreshTokenInfo = { userId, appId, deviceId, scopes }

    next()
  }
}
