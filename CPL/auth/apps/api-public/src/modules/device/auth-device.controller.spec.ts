import { Test, TestingModule } from '@nestjs/testing'
import { DeviceService } from '@lib/device'
import { AuthDeviceController } from './auth-device.controller'
import { AuthDeviceService } from './auth-device.service'

describe('AuthDevicesController', () => {
  let controller: AuthDeviceController

  beforeEach(async () => {
    const DeviceServiceMockProvider = {
      provide: DeviceService,
      useValue: {},
    }
    const AuthDevicesServiceMockProvider = {
      provide: AuthDeviceService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthDeviceController],
      providers: [
        AuthDeviceService,
        DeviceServiceMockProvider,
        AuthDevicesServiceMockProvider,
      ],
    }).compile()

    controller = module.get<AuthDeviceController>(AuthDeviceController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
