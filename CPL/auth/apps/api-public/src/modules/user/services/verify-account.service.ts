import { Injectable } from '@nestjs/common'
import { UserService } from '@lib/user'
import { ConfigService } from '@nestjs/config'
import { AddEmailError, BusinessException } from '@lib/util'
import { SendVerifyEmailDto } from '../dto/send-verify-email.dto'
import { currentTime } from '@lib/util'
import { MailTemplate, NotificationService } from '@lib/grpc-client'
import { EOtpBusiness, OtpResponseDto, OtpService } from '@lib/otp'

@Injectable()
export class VerifyAccountService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
    private readonly otpService: OtpService,
  ) {}

  async sendVerifyEmail(sendVerifyEmailDto: SendVerifyEmailDto, lang: string) {
    const existingUserCheck = await this.userService.checkEmailExist(
      sendVerifyEmailDto.email,
    )
    if (existingUserCheck.exist) {
      throw new BusinessException(existingUserCheck.response)
    }

    // Cần email để tránh dùng otp của email này để xác nhận email khác
    const { otp, ttl, timeBlockResend } = await this.otpService.generateOtp(
      sendVerifyEmailDto.email,
      EOtpBusiness.VERIFY_EMAIL,
    )

    await this.notificationService.sendMail({
      emails: [sendVerifyEmailDto.email],
      data: JSON.stringify({ otp, ttl, time: currentTime() }),
      mailCommand: { lang, template: MailTemplate.VERIFY_EMAIL },
    })

    return new OtpResponseDto(true, timeBlockResend)
  }

  async sendAddEmailOtp(
    sendVerifyEmailDto: SendVerifyEmailDto,
    userId: string,
    lang: string,
  ) {
    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new BusinessException(AddEmailError.USER_DOES_NOT_EXIST)
    }
    if (user.email) {
      throw new BusinessException(AddEmailError.ALREADY_HAVE_AN_EMAIL)
    }

    const existingUserCheck = await this.userService.checkEmailExist(
      sendVerifyEmailDto.email,
      userId,
    )
    if (existingUserCheck.exist) {
      throw new BusinessException(existingUserCheck.response)
    }

    // Cần email để tránh dùng otp của email này để xác nhận email khác
    const { otp, ttl, timeBlockResend } = await this.otpService.generateOtp(
      sendVerifyEmailDto.email,
      EOtpBusiness.VERIFY_EMAIL,
    )

    await this.notificationService.sendMail({
      emails: [sendVerifyEmailDto.email],
      data: JSON.stringify({ otp, ttl, time: currentTime() }),
      mailCommand: { lang, template: MailTemplate.VERIFY_EMAIL },
    })

    return new OtpResponseDto(true, timeBlockResend)
  }
}
