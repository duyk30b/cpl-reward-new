import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '@lib/user'
import global_config from 'config/global_config'
import { ForgotPasswordService } from './forgot-password.service'
import { NotificationService } from '@lib/grpc-client'
import { AuthenticatorOtpService, OtpService } from '@lib/otp'
import { OtpServiceMock } from 'apps/test/mock/common/otp.service.mock'
import { AuthenticatorOtpServiceMock } from 'apps/test/mock/common/authenticator-otp.service.mock'

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService

  beforeEach(async () => {
    const NotificationServiceMockProvider = {
      provide: NotificationService,
      useValue: {},
    }
    const UsersServiceMockProvider = {
      provide: UserService,
      useValue: {},
    }
    const AuthenticatorOtpServiceMockProvider = {
      provide: AuthenticatorOtpService,
      useClass: AuthenticatorOtpServiceMock,
    }
    const OtpServiceMockProvider = {
      provide: OtpService,
      useClass: OtpServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [global_config] })],
      providers: [
        ForgotPasswordService,
        NotificationServiceMockProvider,
        UsersServiceMockProvider,
        AuthenticatorOtpServiceMockProvider,
        OtpServiceMockProvider,
      ],
    }).compile()

    service = module.get<ForgotPasswordService>(ForgotPasswordService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
