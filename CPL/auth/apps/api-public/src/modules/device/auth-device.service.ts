import { Injectable } from '@nestjs/common'
import { BusinessException } from '@lib/util'
import { LogoutAllError, LogoutDeviceError } from '@lib/util'
import { LogoutAllDto } from 'apps/api-public/src/modules/device/dto/logout-all.dto'
import { UserService } from '@lib/user'
import { LogoutDeviceDto } from './dto/logout-device.dto'
import { DeviceService } from '@lib/device'
import { DeviceMapService } from '@lib/device'
import { RedisQueueService } from '@lib/redis-queue'

@Injectable()
export class AuthDeviceService {
  constructor(
    private readonly usersService: UserService,
    private readonly deviceService: DeviceService,
    private readonly deviceMapService: DeviceMapService,
    private readonly redisQueueService: RedisQueueService,
  ) {}

  async logoutAllDevices(
    userId: string,
    currentDeviceId: string,
    logoutAllDto: LogoutAllDto,
  ) {
    const passwordMatched = await this.usersService.checkPasswordWithUserId(
      userId,
      logoutAllDto.password,
    )
    if (!passwordMatched) {
      throw new BusinessException(LogoutAllError.WRONG_PASSWORD)
    }
    await this.usersService.logoutAllDevices(userId, currentDeviceId)
    await this.deviceMapService.forgetAllDevices(userId, currentDeviceId)
  }

  async logoutDevice(
    userId: string,
    deviceId: string,
    logoutDeviceDto: LogoutDeviceDto,
  ) {
    const passwordMatched = await this.usersService.checkPasswordWithUserId(
      userId,
      logoutDeviceDto.password,
    )
    if (!passwordMatched) {
      throw new BusinessException(LogoutDeviceError.WRONG_PASSWORD)
    }
    await this.usersService.logout(userId, deviceId)
    await this.deviceMapService.forgetDevice(userId, deviceId)

    this.redisQueueService.addUserProactivelyLogoutJob({ userId, deviceId })
  }

  async getDevicesByUserId(userId: string) {
    const deviceMaps = await this.deviceMapService.getAllUserDeviceMap(userId)
    const deviceIds = deviceMaps.map((deviceMap) => deviceMap.deviceId)
    const devices = await this.deviceService.getDeviceByIds(deviceIds)
    devices.forEach((device) => {
      device['detail'] = deviceMaps.find(
        (deviceMap) => deviceMap.deviceId == device.id,
      )
    })
    devices.sort((a, b) => b['detail'].lastLogin - a['detail'].lastLogin)
    return devices
  }
}
