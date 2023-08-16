import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BusinessException } from '@lib/util'
import { ForgotPasswordError } from '@lib/util'
import { UserService } from '@lib/user'
import { ResetPasswordDto } from '../dto/reset-password.dto'
import { SendForgotPasswordOtpDto } from '../dto/send-forgot-password-otp.dto'

import { currentTime } from '@lib/util'
import { MailTemplate, NotificationService } from '@lib/grpc-client'
import {
  AuthenticatorOtpService,
  EOtpBusiness,
  OtpResponseDto,
  OtpService,
} from '@lib/otp'
import { RedisQueueService } from '@lib/redis-queue'

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
    private readonly authenticatorOtpService: AuthenticatorOtpService,
    private readonly otpService: OtpService,
    private readonly redisQueueService: RedisQueueService,
  ) {}

  async sendForgotPasswordOtp(
    sendForgotPasswordOtpDto: SendForgotPasswordOtpDto,
    lang: string,
  ) {
    const user = await this.userService.getUserByEmail(
      sendForgotPasswordOtpDto.email,
    )
    if (!user) {
      throw new BusinessException(ForgotPasswordError.USER_DOES_NOT_EXIST)
    }

    const { otp, ttl, timeBlockResend } = await this.otpService.generateOtp(
      user.id,
      EOtpBusiness.FORGOT_PASSWORD,
    )

    await this.notificationService.sendMail({
      userIds: [user.id],
      data: JSON.stringify({ otp, ttl, time: currentTime() }),
      mailCommand: {
        lang,
        template: MailTemplate.PASSWORD_RESET,
      },
    })

    return new OtpResponseDto(true, timeBlockResend)
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.getUserByEmailWithPrivateField(
      resetPasswordDto.email,
    )
    if (!user) {
      throw new BusinessException(ForgotPasswordError.USER_DOES_NOT_EXIST)
    }

    await this.otpService.validateOtp(
      resetPasswordDto.otp,
      user.id,
      EOtpBusiness.FORGOT_PASSWORD,
      new BusinessException(ForgotPasswordError.WRONG_OTP),
    )

    if (user.isAuthenticatorVerified) {
      if (!resetPasswordDto.authenticatorOtp) {
        throw new BusinessException(ForgotPasswordError.NEED_AUTHENTICATOR_OTP)
      }
      await this.authenticatorOtpService.validateAuthenticatorOtp(
        resetPasswordDto.authenticatorOtp,
        user,
      )
    }

    await this.userService.setNewPassword(user, resetPasswordDto.newPassword)

    this.redisQueueService.addUserChangePasswordJob({
      userId: user.id,
      isReset: true,
    })

    await this.otpService.markUsedOtp(user.id, EOtpBusiness.FORGOT_PASSWORD)
  }
}
