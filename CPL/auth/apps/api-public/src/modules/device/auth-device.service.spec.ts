import { Test, TestingModule } from '@nestjs/testing'
import { DeviceMapService } from '@lib/device'
import { DeviceService } from '@lib/device'
import { UserService } from '@lib/user'
import { DeviceMapServiceMock } from 'apps/test/mock/common/device-map.service.mock'
import { DevicesServiceMock } from 'apps/test/mock/common/devices.service.mock'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { AuthDeviceService } from './auth-device.service'

describe('AuthDevicesService', () => {
  let service: AuthDeviceService
  let usersServiceMock: UserService

  beforeEach(async () => {
    const UsersServiceMockProvider = {
      provide: UserService,
      useClass: UsersServiceMock,
    }
    const DeviceServiceMockProvider = {
      provide: DeviceService,
      useClass: DevicesServiceMock,
    }
    const DeviceMapServiceMockProvider = {
      provide: DeviceMapService,
      useClass: DeviceMapServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthDeviceService,
        UsersServiceMockProvider,
        DeviceServiceMockProvider,
        DeviceMapServiceMockProvider,
      ],
    }).compile()

    service = module.get<AuthDeviceService>(AuthDeviceService)
    usersServiceMock = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('logoutAllDevices', () => {
    it('should logout user from all device', () => {
      const userId = '1'
      const currentUserDevice = '1'
      const logoutAllDto = { password: '111111' }

      jest
        .spyOn(usersServiceMock, 'checkPasswordWithUserId')
        .mockResolvedValue(true)

      expect(
        service.logoutAllDevices(userId, currentUserDevice, logoutAllDto),
      ).resolves.not.toThrow()
    })
  })
})
