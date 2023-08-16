import { RedisService } from '@lib/redis'
import { Admin } from '@lib/admin/entities/admin.entity'
import { Injectable } from '@nestjs/common'
import { generateAuthenticatorOtp } from './otp.helper'
import { decryptOtpSecret } from '@lib/util/helpers/encryption.helper'
import { BusinessException } from '@lib/util'
import { AuthenticatorError } from '@lib/util/formater/error'

const AUTHENTICATOR_TTL = 30

@Injectable()
export class AuthenticatorOtpService {
  constructor(private readonly redisService: RedisService) {}

  async validateAuthenticatorOtp(otp: string, admin: Admin) {
    const validOtp = generateAuthenticatorOtp(decryptOtpSecret(admin.otpSecret))
    if (otp != validOtp) {
      throw new BusinessException(AuthenticatorError.WRONG_AUTHENTICATOR_OTP)
    }

    const otpUsed = await this.redisService.get(
      this.getRedisAuthenticatorKey(admin.id.toString(), otp),
    )
    if (!!otpUsed) {
      throw new BusinessException(AuthenticatorError.AUTHENTICATOR_CODE_USED)
    }
  }

  async markUsedAuthenticatorOtp(adminId: string, otp: string) {
    await this.redisService.set(
      this.getRedisAuthenticatorKey(adminId, otp),
      otp,
      {
        ttl: AUTHENTICATOR_TTL,
      },
    )
  }

  private getRedisAuthenticatorKey(adminId: string, otp: string) {
    return `OTPCode:${adminId}:${otp}`
  }
}
