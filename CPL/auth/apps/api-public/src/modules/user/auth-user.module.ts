import { AuthorizationModule } from '@lib/authorization'
import { BlacklistModule } from '@lib/blacklist'
import { DeviceModule } from '@lib/device'
import { FirebaseModule } from '@lib/firebase'
import { ExchangeModule, BOModule, NotificationModule } from '@lib/grpc-client'
import { LoginHistoryModule } from '@lib/login-history'
import { OtpModule } from '@lib/otp'
import { RedisModule } from '@lib/redis'
import { RedisQueueModule } from '@lib/redis-queue'
import { SafeUserModule } from '@lib/safe-user'
import { UserModule } from '@lib/user'
import { UserEmailModule } from '@lib/user-email'
import { UserKycModule } from '@lib/user-kyc'
import { UserSettingModule } from '@lib/user-setting'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BlackUserModule } from 'libs/black-user/src/black-user.module'
import { UnlimitedUserModule } from 'libs/unlimited-user/src/unlimited-user.module'
import { AuthUserController } from './auth-user.controller'
import { AuthLoginService } from './services/auth-login.service'
import { AuthLogoutService } from './services/auth-logout.service'
import { AuthRegisterService } from './services/auth-register.service'
import { AuthUserService } from './services/auth-user.service'
import { ChangePasswordService } from './services/change-password.service'
import { ForgotPasswordService } from './services/forgot-password.service'
import { SocialService } from './services/social.service'
import { VerifyAccountService } from './services/verify-account.service'

@Module({
  imports: [
    ConfigModule,
    AuthorizationModule,
    UserModule,
    DeviceModule,
    BlacklistModule,
    NotificationModule,
    OtpModule,
    LoginHistoryModule,
    BlackUserModule,
    UnlimitedUserModule,
    UserSettingModule,
    SafeUserModule,
    UserKycModule,
    UserEmailModule,
    RedisQueueModule,
    RedisModule,
    ExchangeModule,
    BOModule,
    FirebaseModule,
  ],
  controllers: [AuthUserController],
  providers: [
    AuthRegisterService,
    AuthLoginService,
    AuthRegisterService,
    AuthLogoutService,
    ChangePasswordService,
    VerifyAccountService,
    ForgotPasswordService,
    SocialService,
    AuthUserService,
  ],
})
export class AuthUserModule {}
