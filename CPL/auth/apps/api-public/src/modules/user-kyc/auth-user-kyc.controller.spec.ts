import { Test, TestingModule } from '@nestjs/testing'
import { AuthUserKycController } from './auth-user-kyc.controller'
import { AuthUserKycService } from './auth-user-kyc.service'

describe('AuthUserKycController', () => {
  let controller: AuthUserKycController

  beforeEach(async () => {
    const AuthUserKycServiceMockProvider = {
      provide: AuthUserKycService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUserKycController],
      providers: [AuthUserKycServiceMockProvider],
    }).compile()

    controller = module.get<AuthUserKycController>(AuthUserKycController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
