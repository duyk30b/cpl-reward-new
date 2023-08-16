import { RedisService } from '@lib/redis'
import { User } from '@lib/user/entities/user.entity'
import {
  AuthenticatorError,
  BusinessException,
  decryptOtpSecret,
} from '@lib/util'
import { Injectable } from '@nestjs/common'
import { generateAuthenticatorOtp } from './otp.helper'

const AUTHENTICATOR_TTL = 30

@Injectable()
export class AuthenticatorOtpService {
  constructor(private readonly redisService: RedisService) {}

  async validateAuthenticatorOtp(otp: string, user: User) {
    const validOtp = generateAuthenticatorOtp(decryptOtpSecret(user.otpSecret))
    if (otp != validOtp) {
      throw new BusinessException(AuthenticatorError.WRONG_AUTHENTICATOR_OTP)
    }

    const otpUsed = await this.redisService.get(
      this.getRedisAuthenticatorKey(user.id, otp),
    )
    if (!!otpUsed) {
      throw new BusinessException(AuthenticatorError.AUTHENTICATOR_CODE_USED)
    }
  }

  async markUsedAuthenticatorOtp(userId: string, otp: string) {
    await this.redisService.set(
      this.getRedisAuthenticatorKey(userId, otp),
      otp,
      AUTHENTICATOR_TTL,
    )
  }

  private getRedisAuthenticatorKey(userId: string, otp: string) {
    return `OTPCode:${userId}:${otp}`
  }
}
