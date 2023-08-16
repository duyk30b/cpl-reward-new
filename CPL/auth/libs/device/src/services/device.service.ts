import { Injectable } from '@nestjs/common'
import { CreateDeviceDto } from '../dto/create-device.dto'
import { Device } from '../entities/device.entity'
import { v4 as uuidv4 } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  create(createDeviceDto: CreateDeviceDto) {
    const newDevice = new Device()
    newDevice.uuid = uuidv4()
    newDevice.deviceInfo = createDeviceDto.deviceInfo
    newDevice.deviceHash = createDeviceDto.deviceHash

    return this.deviceRepository.save(newDevice)
  }

  async createIfNotExist(createDeviceDto: CreateDeviceDto) {
    const device = await this.deviceRepository.findOne({
      deviceHash: createDeviceDto.deviceHash,
    })
    if (device && device.id) {
      if (device.deviceInfo != createDeviceDto.deviceInfo) {
        device.deviceInfo = createDeviceDto.deviceInfo
        return await this.deviceRepository.save(device)
      }
      return device
    } else {
      return await this.create(createDeviceDto)
    }
  }

  async getDeviceByDeviceHash(deviceHash: string) {
    return await this.deviceRepository.findOne({
      deviceHash: deviceHash,
    })
  }

  async getDeviceById(deviceId: string) {
    return await this.deviceRepository.findOne({
      id: deviceId,
    })
  }

  async getDeviceByIds(deviceIds: string[]) {
    return await this.deviceRepository.find({
      id: In(deviceIds),
    })
  }
}
