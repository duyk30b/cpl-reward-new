import { Injectable, NestMiddleware } from '@nestjs/common'
import { BusinessException } from '@lib/util'
import { BlacklistError } from '@lib/util'
import { BlacklistDeviceService } from '@lib/blacklist'
import { DeviceService } from '@lib/device'
import { Request } from 'express'

@Injectable()
export class ValidateBlacklistDeviceMiddleware implements NestMiddleware {
  constructor(
    private devicesService: DeviceService,
    private blacklistDeviceService: BlacklistDeviceService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const deviceHash = req.header('device_hash')
    const device = await this.devicesService.getDeviceByDeviceHash(deviceHash)

    if (!device) return next()

    const deviceBlacklisted =
      await this.blacklistDeviceService.checkDeviceBlacklisted(device.id)
    if (deviceBlacklisted)
      throw new BusinessException(BlacklistError.DEVICE_BLACKLISTED)

    next()
  }
}
