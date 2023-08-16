import { Module } from '@nestjs/common'
import { ReCaptchaService } from './re-captcha.service'
import { ConfigModule } from '@nestjs/config'
import captchaConfig from '../src/re-captcha.config'
import { HttpModule } from '@nestjs/axios'
import { RedisModule } from '@lib/redis'

@Module({
  imports: [ConfigModule.forFeature(captchaConfig), HttpModule, RedisModule],
  providers: [ReCaptchaService],
  exports: [ReCaptchaService],
})
export class ReCaptchaModule {}
