import { Injectable } from '@nestjs/common'
import { BusinessException } from '@lib/util'
import { ChangePasswordError } from '@lib/util'
import { ChangePasswordDto } from 'apps/api-public/src/modules/user/dto/change-password.dto'
import { UserService } from '@lib/user'
import { AuthenticatorOtpService } from '@lib/otp'
import { RedisQueueService } from '@lib/redis-queue'

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly usersService: UserService,
    private readonly authenticatorOtpService: AuthenticatorOtpService,
    private readonly redisQueueService: RedisQueueService,
  ) {}

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.getUserByIdWithPrivateField(userId)
    if (!user) {
      throw new BusinessException(ChangePasswordError.USER_DOES_NOT_EXIST)
    }

    const passwordMatched = this.usersService.checkPasswordWithUser(
      user,
      changePasswordDto.oldPassword,
    )
    if (!passwordMatched) {
      throw new BusinessException(ChangePasswordError.WRONG_PASSWORD)
    }

    if (changePasswordDto.newPassword === changePasswordDto.oldPassword) {
      throw new BusinessException(ChangePasswordError.SAME_AS_OLD_PASSWORD)
    }

    if (user.isAuthenticatorVerified) {
      // if (!changePasswordDto.authenticatorOtp) {
      //   throw new BusinessException(ChangePasswordError.NEED_AUTHENTICATOR_OTP)
      // }
      await this.authenticatorOtpService.validateAuthenticatorOtp(
        changePasswordDto.authenticatorOtp,
        user,
      )
    }

    await this.usersService.setNewPassword(user, changePasswordDto.newPassword)

    this.redisQueueService.addUserChangePasswordJob({ userId: user.id })

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.markUsedAuthenticatorOtp(
        user.id,
        changePasswordDto.authenticatorOtp,
      )
    }
  }
}
