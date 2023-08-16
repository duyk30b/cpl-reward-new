import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlacklistDevice } from '../entities/blacklist-device.entity'

@Injectable()
export class BlacklistDeviceService {
  constructor(
    @InjectRepository(BlacklistDevice)
    private readonly blacklistDeviceRepository: Repository<BlacklistDevice>,
  ) {}

  async checkDeviceBlacklisted(deviceId: string): Promise<boolean> {
    const blacklist = await this.blacklistDeviceRepository.findOne({
      deviceId: deviceId,
    })
    return !!blacklist
  }

  async upsertDeviceToBlacklist(
    deviceId: string,
    note: string,
    effectiveHour: number,
  ) {
    const until = new Date().getTime() + effectiveHour * 60 * 60 * 1000

    const existing = await this.blacklistDeviceRepository.findOne({
      deviceId: deviceId,
    })

    if (existing) {
      existing.note = note
      existing.until = until
      return await this.blacklistDeviceRepository.update(
        { deviceId: deviceId },
        existing,
      )
    }

    const blacklistDevice = new BlacklistDevice()
    blacklistDevice.deviceId = deviceId
    blacklistDevice.note = note
    blacklistDevice.until = until
    return await this.blacklistDeviceRepository.save(blacklistDevice)
  }
}
