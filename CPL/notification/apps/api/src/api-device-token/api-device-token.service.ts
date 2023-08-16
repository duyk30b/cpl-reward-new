import { DeviceTokenService } from '@libs/device-token'
import { RedisLockService } from '@libs/redis'
import { ConflictException, Injectable, Logger } from '@nestjs/common'
import { ApiRegisterTokenDto } from './api-device-token.dto'

@Injectable()
export class ApiDeviceTokenService {
  private readonly logger = new Logger(ApiDeviceTokenService.name)
  constructor(
    private readonly deviceTokenService: DeviceTokenService,
    private readonly redisLockService: RedisLockService,
  ) {}

  async registerToken(
    userId: string,
    deviceId: string,
    registerTokenDto: ApiRegisterTokenDto,
  ) {
    const lock = await this.redisLockService
      .acquire([`token:register:${userId}-${deviceId}`], 3000, {
        retryCount: 20,
        retryDelay: 500,
        retryJitter: 200,
      })
      .catch((e) => {
        this.logger.warn(e)
        throw new ConflictException()
      })

    try {
      await this.deviceTokenService.registerToken({
        userId,
        deviceId,
        token: registerTokenDto.token,
      })

      return { success: true }
    } finally {
      await lock.release()
    }
  }
}
