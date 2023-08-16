import { Test, TestingModule } from '@nestjs/testing'
import { UserInfoHistoryService, UserInfoService } from '@lib/user'
import { UserService } from '@lib/user'
import { UserInfoHistoryServiceMock } from 'apps/test/mock/common/user-info-history.service.mock'
import { UserInfoServiceMock } from 'apps/test/mock/common/user-info.service.mock'
import { UsersServiceMock } from 'apps/test/mock/common/users.service.mock'
import { AuthUserInfoService } from './auth-user-info.service'

describe('AuthUserInfoService', () => {
  let service: AuthUserInfoService

  beforeEach(async () => {
    const UserInfoServiceProvider = {
      provide: UserInfoService,
      useClass: UserInfoServiceMock,
    }
    const UserInfoHistoryServiceProvider = {
      provide: UserInfoHistoryService,
      useClass: UserInfoHistoryServiceMock,
    }
    const UserServiceProvider = {
      provide: UserService,
      useClass: UsersServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUserInfoService,
        UserInfoServiceProvider,
        UserServiceProvider,
        UserInfoHistoryServiceProvider,
      ],
    }).compile()

    service = module.get<AuthUserInfoService>(AuthUserInfoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
