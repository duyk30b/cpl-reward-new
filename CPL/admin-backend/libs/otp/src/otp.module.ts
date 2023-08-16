import { RedisModule } from '@lib/redis'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import otp from 'config/otp'
import { AuthenticatorOtpService } from './authenticator-otp.service'
import { OtpService } from './otp.service'

@Module({
  imports: [ConfigModule.forFeature(otp), RedisModule],
  providers: [OtpService, AuthenticatorOtpService],
  exports: [OtpService, AuthenticatorOtpService],
})
export class OtpModule {}
