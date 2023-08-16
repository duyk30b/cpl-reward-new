import { Test, TestingModule } from '@nestjs/testing'
import { BlacklistUserService } from '@lib/blacklist'
import { DeviceMapService } from '@lib/device'
import { DeviceService } from '@lib/device'
import { UserService } from '@lib/user'
import { BlacklistUserServiceMock } from 'apps/test/mock/common/blacklist-user.service.mock'
import { DeviceMapServiceMock } from 'apps/test/mock/common/device-map.service.mock'
import { DevicesServiceMock } from 'apps/test/mock/common/devices.service.mock'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { SocialService } from './social.service'

describe('SocialService', () => {
  let service: SocialService

  beforeEach(async () => {
    const DevicesServiceMockProvider = {
      provide: DeviceService,
      useClass: DevicesServiceMock,
    }
    const DeviceMapServiceMockProvider = {
      provide: DeviceMapService,
      useClass: DeviceMapServiceMock,
    }
    const UsersServiceMockProvider = {
      provide: UserService,
      useClass: UsersServiceMock,
    }
    const BlacklistUserServiceMockProvider = {
      provide: BlacklistUserService,
      useClass: BlacklistUserServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialService,
        DevicesServiceMockProvider,
        DeviceMapServiceMockProvider,
        UsersServiceMockProvider,
        BlacklistUserServiceMockProvider,
      ],
    }).compile()

    service = module.get<SocialService>(SocialService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
