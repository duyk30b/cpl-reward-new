import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserKyc } from './entities/user-kyc.entity'
import { UserKycHistory } from './entities/user-kyc-history.entity'
import { UserKycHistoryService } from '@lib/user-kyc/services/user-kyc-history.service'
import { UserKycService } from '@lib/user-kyc/services/user-kyc.service'
import { UserKycCaptchaService } from '@lib/user-kyc/services/user-kyc-captcha.service'
import { UserKycCaptcha } from '@lib/user-kyc/entities/user-kyc-captcha.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserKyc, UserKycHistory, UserKycCaptcha]),
  ],
  providers: [UserKycHistoryService, UserKycService, UserKycCaptchaService],
  exports: [UserKycHistoryService, UserKycService, UserKycCaptchaService],
})
export class UserKycModule {}
