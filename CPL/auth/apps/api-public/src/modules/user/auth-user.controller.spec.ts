import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '@lib/user'
import { AuthUserController } from './auth-user.controller'
import { AuthLoginService } from './services/auth-login.service'
import { AuthLogoutService } from './services/auth-logout.service'
import { AuthRegisterService } from './services/auth-register.service'
import { AuthUserService } from './services/auth-user.service'
import { ChangePasswordService } from './services/change-password.service'
import { ForgotPasswordService } from './services/forgot-password.service'
import { SocialService } from './services/social.service'
import { VerifyAccountService } from './services/verify-account.service'

describe('AuthUsersController', () => {
  let controller: AuthUserController

  beforeEach(async () => {
    const AuthRegisterServiceMockProvider = {
      provide: AuthRegisterService,
      useValue: {},
    }
    const AuthLogoutServiceMockProvider = {
      provide: AuthLogoutService,
      useValue: {},
    }
    const AuthLoginServiceMockProvider = {
      provide: AuthLoginService,
      useValue: {},
    }
    const UsersServiceMockProvider = {
      provide: UserService,
      useValue: {},
    }
    const ChangePasswordServiceMockProvider = {
      provide: ChangePasswordService,
      useValue: {},
    }
    const VerifyAccountServiceMockProvider = {
      provide: VerifyAccountService,
      useValue: {},
    }
    const ForgotPasswordServiceMockProvider = {
      provide: ForgotPasswordService,
      useValue: {},
    }
    const SocialServiceMockProvider = {
      provide: SocialService,
      useValue: {},
    }
    const AuthUserServiceMockProvider = {
      provide: AuthUserService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUserController],
      providers: [
        AuthRegisterService,
        AuthRegisterServiceMockProvider,
        AuthLogoutServiceMockProvider,
        AuthLoginServiceMockProvider,
        UsersServiceMockProvider,
        ChangePasswordServiceMockProvider,
        VerifyAccountServiceMockProvider,
        ForgotPasswordServiceMockProvider,
        SocialServiceMockProvider,
        AuthUserServiceMockProvider,
      ],
    }).compile()

    controller = module.get<AuthUserController>(AuthUserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
