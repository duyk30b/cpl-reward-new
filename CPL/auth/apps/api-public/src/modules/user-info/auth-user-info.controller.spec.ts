import { Test, TestingModule } from '@nestjs/testing'
import { AuthUserInfoController } from './auth-user-info.controller'
import { AuthUserInfoService } from './auth-user-info.service'

describe('AuthUserInfoController', () => {
  let controller: AuthUserInfoController

  beforeEach(async () => {
    const AuthUserInfoServiceMockProvider = {
      provide: AuthUserInfoService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUserInfoController],
      providers: [AuthUserInfoServiceMockProvider],
    }).compile()

    controller = module.get<AuthUserInfoController>(AuthUserInfoController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
