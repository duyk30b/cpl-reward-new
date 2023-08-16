import { Injectable } from '@nestjs/common'
import { CreateDeviceMapDto } from '../dto/create-device-map.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { DeviceMap } from '../entities/device-map.entity'

@Injectable()
export class DeviceMapService {
  constructor(
    @InjectRepository(DeviceMap)
    private readonly deviceMapRepository: Repository<DeviceMap>,
  ) {}

  create(createDeviceMapDto: CreateDeviceMapDto) {
    const newDeviceMap = new DeviceMap()
    newDeviceMap.userId = createDeviceMapDto.userId
    newDeviceMap.deviceId = createDeviceMapDto.deviceId
    newDeviceMap.lastLogin = createDeviceMapDto.lastLogin
    newDeviceMap.lastIp = createDeviceMapDto.lastIp

    return this.deviceMapRepository.save(newDeviceMap)
  }

  async addDeviceToUser(createDeviceMapDto: CreateDeviceMapDto) {
    const existing = await this.deviceMapRepository.findOne({
      userId: createDeviceMapDto.userId,
      deviceId: createDeviceMapDto.deviceId,
    })
    if (existing && existing.id) {
      existing.lastLogin = createDeviceMapDto.lastLogin
      existing.lastIp = createDeviceMapDto.lastIp
      await this.deviceMapRepository.save(existing)
      return existing
    } else {
      return await this.create(createDeviceMapDto)
    }
  }

  async getAllUserDeviceIds(userId: string) {
    const deviceMaps = await this.deviceMapRepository.find({ userId: userId })
    return deviceMaps.map((el) => el.deviceId)
  }

  async getAllUserDeviceMap(userId: string) {
    return await this.deviceMapRepository.find({ userId: userId })
  }

  async checkUserHasDevice(userId: string, deviceId: string) {
    const deviceMap = await this.deviceMapRepository.findOne({
      userId: userId,
      deviceId: deviceId,
    })
    return !!deviceMap
  }

  async forgetDevice(userId: string, deviceId: string) {
    await this.deviceMapRepository.delete({ userId, deviceId })
  }

  async forgetAllDevices(userId: string, exceptDeviceId?: string) {
    await this.deviceMapRepository.delete({
      userId,
      deviceId: Not(exceptDeviceId),
    })
  }
}
