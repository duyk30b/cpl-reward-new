import { RedisService } from '@lib/redis'
import { BusinessException, OtpError, randomString } from '@lib/util'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class OtpService {
  otpLength: number
  otpTtl: number
  timeBlockResend: number
  ignoreOtpUsers: string[]

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.otpTtl = this.configService.get('otp.ttl')
    this.otpLength = this.configService.get('otp.length')
    this.timeBlockResend = this.configService.get('otp.time_block_resend')
    this.ignoreOtpUsers = this.configService.get('otp.ignore_otp_users')
  }

  async generateOtp(target: string, business: string) {
    const blockResend = await this.redisService.get(
      this.getRedisBlockResendOtpKey(target, business),
    )

    if (!!blockResend) {
      throw new BusinessException(OtpError.RESEND_BLOCKING)
    }

    const otp = randomString(this.otpLength).toUpperCase()
    await this.redisService.set(
      this.getRedisOtpKey(target, business),
      otp,
      this.otpTtl,
    )
    await this.redisService.set(
      this.getRedisBlockResendOtpKey(target, business),
      1,
      this.timeBlockResend,
    )
    return {
      otp,
      ttl: this.otpTtl,
      timeBlockResend: this.timeBlockResend,
    }
  }

  async validateOtp(
    otp: string,
    target: string,
    business: string,
    exception: BusinessException,
    userId = null,
  ): Promise<void> {
    const env = this.configService.get('env')
    if (
      (env == 'local' || env == 'dev' || env == 'stg-v2') &&
      otp == '674568'
    ) {
      return
    }

    if (userId && this.ignoreOtpUsers.includes(userId)) {
      return
    }

    const validOtp = await this.redisService.get(
      this.getRedisOtpKey(target, business),
    )
    if (otp != validOtp) {
      throw exception
    }
  }

  async markUsedOtp(target: string, business: string) {
    await this.redisService.del(this.getRedisOtpKey(target, business))
  }

  private getRedisOtpKey(target: string, business: string) {
    return `otp:${target}:${business}`
  }

  private getRedisBlockResendOtpKey(target: string, business: string) {
    return `block_resend_otp:${target}:${business}`
  }
}
