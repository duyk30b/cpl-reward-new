import { Module } from '@nestjs/common'
import { KycCaptchaService } from './kyc-captcha.service'

@Module({
  providers: [KycCaptchaService],
  exports: [KycCaptchaService],
})
export class KycCaptchaModule {}
