import { Module } from '@nestjs/common'
import { AuthUserKycService } from './auth-user-kyc.service'
import { AuthUserKycController } from './auth-user-kyc.controller'
import { UserModule } from '@lib/user'
import { UploadFileModule } from '@lib/upload-file'
import { RedisQueueModule } from '@lib/redis-queue'
import { ConfigModule } from '@nestjs/config'
import liveness from '../../../../../config/liveness'
import { HttpModule } from '@nestjs/axios'
import { FlowsModule } from '@lib/flows'
import { AresModule } from '@lib/ares'
import { UserKycModule } from '@lib/user-kyc'
import { KycCaptchaModule } from '@lib/kyc-captcha'
import kyc from 'config/kyc'
import { AuthSettingModule } from '@lib/auth-setting'

@Module({
  imports: [
    UserKycModule,
    FlowsModule,
    UserModule,
    UploadFileModule,
    UserModule,
    AresModule,
    RedisQueueModule,
    HttpModule,
    ConfigModule.forRoot({ load: [liveness, kyc] }),
    KycCaptchaModule,
    AuthSettingModule,
  ],
  controllers: [AuthUserKycController],
  providers: [AuthUserKycService],
})
export class AuthUserKycModule {}
