import { Module } from '@nestjs/common'
import { AuthenticatorService } from './authenticator.service'
import { AuthenticatorController } from './authenticator.controller'
import { AuthorizationModule } from '@lib/authorization'
import { BlacklistModule } from '@lib/blacklist'
import { DeviceModule } from '@lib/device'
import { UserModule } from '@lib/user'
import { ConfigModule } from '@nestjs/config'
import { OtpModule } from '@lib/otp'

@Module({
  imports: [
    AuthorizationModule,
    UserModule,
    DeviceModule,
    BlacklistModule,
    ConfigModule,
    OtpModule,
  ],
  controllers: [AuthenticatorController],
  providers: [AuthenticatorService],
})
export class AuthenticatorModule {}
