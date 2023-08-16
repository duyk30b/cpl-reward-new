import { createMockRepositoryProvider } from '@lib/util'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateDeviceMapDto } from '../dto/create-device-map.dto'
import { DeviceMap } from '../entities/device-map.entity'
import { DeviceMapService } from './device-map.service'

const deviceMap = new DeviceMap()
deviceMap.id = 1
deviceMap.userId = '1'
deviceMap.deviceId = 1

describe('DeviceMapService', () => {
  let service: DeviceMapService
  let deviceMapRepositoryMock: Repository<DeviceMap>

  beforeEach(async () => {
    const DeviceMapRepositoryProvider = createMockRepositoryProvider(DeviceMap)
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceMapService, DeviceMapRepositoryProvider],
    }).compile()

    service = module.get<DeviceMapService>(DeviceMapService)
    deviceMapRepositoryMock = module.get(getRepositoryToken(DeviceMap))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should return a device map', () => {
      const deviceMapRepositoryMockSpy = jest
        .spyOn(deviceMapRepositoryMock, 'save')
        .mockResolvedValue(deviceMap)
      expect(service.create(new CreateDeviceMapDto())).resolves.toEqual(
        deviceMap,
      )
      expect(deviceMapRepositoryMockSpy).toHaveBeenCalled()
    })
  })

  describe('addDeviceToUser', () => {
    it('should create and return a new device map', () => {
      jest.spyOn(deviceMapRepositoryMock, 'findOne').mockResolvedValue(null)
      jest.spyOn(service, 'create').mockResolvedValue(deviceMap)
      expect(
        service.addDeviceToUser(new CreateDeviceMapDto()),
      ).resolves.toEqual(deviceMap)
    })

    it('should return an existing device map', () => {
      jest
        .spyOn(deviceMapRepositoryMock, 'findOne')
        .mockResolvedValue(deviceMap)
      expect(
        service.addDeviceToUser(new CreateDeviceMapDto()),
      ).resolves.toEqual(deviceMap)
    })
  })

  describe('getAllUserDeviceIds', () => {
    it('should return all device ids of a user', () => {
      const userId = '1'
      jest.spyOn(deviceMapRepositoryMock, 'find').mockResolvedValue([deviceMap])
      expect(service.getAllUserDeviceIds(userId)).resolves.toEqual(
        [deviceMap].map((el) => el.deviceId),
      )
    })
  })
})
