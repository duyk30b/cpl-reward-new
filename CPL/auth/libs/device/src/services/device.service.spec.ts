import { Test, TestingModule } from '@nestjs/testing'
import { Device } from '../entities/device.entity'
import { DeviceService } from './device.service'
import { v4 as uuidv4 } from 'uuid'
import { createMockRepositoryProvider } from '@lib/util'

const device = new Device()
device.uuid = uuidv4()
device.deviceInfo = 'test'
device.deviceHash = 'test'

describe('DevicesService', () => {
  let service: DeviceService

  beforeEach(async () => {
    const DeviceRepositoryProvider = createMockRepositoryProvider(Device)
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceService, DeviceRepositoryProvider],
    }).compile()

    service = module.get<DeviceService>(DeviceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
