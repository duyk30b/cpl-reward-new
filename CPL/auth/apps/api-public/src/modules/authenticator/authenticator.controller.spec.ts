import { Test, TestingModule } from '@nestjs/testing'
import { AuthenticatorController } from './authenticator.controller'
import { AuthenticatorService } from './authenticator.service'

describe('AuthenticatorController', () => {
  let controller: AuthenticatorController

  beforeEach(async () => {
    const AuthenticatorServiceMockProvider = {
      provide: AuthenticatorService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticatorController],
      providers: [AuthenticatorServiceMockProvider],
    }).compile()

    controller = module.get<AuthenticatorController>(AuthenticatorController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
