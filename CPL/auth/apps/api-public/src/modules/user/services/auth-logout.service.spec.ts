import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '@lib/user'
import { AuthLogoutService } from './auth-logout.service'

describe('AuthLogoutService', () => {
  let service: AuthLogoutService

  beforeEach(async () => {
    const UsersServiceMockProvider = {
      provide: UserService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthLogoutService, UsersServiceMockProvider],
    }).compile()

    service = module.get<AuthLogoutService>(AuthLogoutService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
