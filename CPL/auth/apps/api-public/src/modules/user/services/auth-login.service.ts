import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BusinessException, getDeviceHashFromDeviceInfo } from '@lib/util'
import { BlacklistError, LoginError } from '@lib/util'
import { BlacklistUserService } from '@lib/blacklist'
import { CreateDeviceDto } from '@lib/device/dto/create-device.dto'
import { DeviceMapService } from '@lib/device'
import { DeviceService } from '@lib/device'
import { UserStatus, UserType } from '@lib/user/enum/user.enum'
import { UserService } from '@lib/user'
import { AuthLoginDto } from '../dto/auth-login.dto'
import { SendDeviceVerificationOtpDto } from '../dto/send-device-verification-otp.dto'
import {
  currentTime,
  getBrowserFromDeviceInfo,
  getOSFromDeviceInfo,
  parseDeviceInfo,
} from '@lib/util'
import { MailTemplate, NotificationService } from '@lib/grpc-client'
import {
  AuthenticatorOtpService,
  EOtpBusiness,
  OtpResponseDto,
  OtpService,
} from '@lib/otp'
import { RedisQueueService } from '@lib/redis-queue'

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly devicesService: DeviceService,
    private readonly deviceMapService: DeviceMapService,
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
    private readonly blacklistUserService: BlacklistUserService,
    private readonly authenticatorOtpService: AuthenticatorOtpService,
    private readonly otpService: OtpService,
    private readonly redisQueueService: RedisQueueService,
  ) {}

  async login(
    loginDto: AuthLoginDto,
    deviceInfo: string,
    deviceHash: string,
    ip: string,
    lang: string,
  ) {
    // Require email or phone
    if (!loginDto.email && !loginDto.phone) {
      throw new BusinessException(LoginError.MISSING_BOTH_EMAIL_AND_PHONE)
    }

    const user = await this.usersService.getLoginUser(loginDto)

    if (!user || user.type == UserType.BOT) {
      throw new BusinessException(LoginError.USER_DOES_NOT_EXIST)
    }

    if (!this.usersService.checkPasswordWithUser(user, loginDto.password)) {
      throw new BusinessException(LoginError.WRONG_PASSWORD)
    }

    if (user.status == UserStatus.INACTIVE) {
      throw new BusinessException(LoginError.INACTIVE_USER)
    }

    const userBlacklisted =
      await this.blacklistUserService.checkUserBlacklisted(user.id)

    if (userBlacklisted)
      throw new BusinessException(BlacklistError.USER_BLACKLISTED)

    if (user.requestDeleteAt) {
      throw new BusinessException(LoginError.USER_BEING_DELETED)
    }

    await this.usersService.useAuthPasswordEncryptor(user, loginDto.password)

    const createDeviceDto = new CreateDeviceDto()
    createDeviceDto.deviceInfo = deviceInfo
    createDeviceDto.deviceHash = deviceHash
    const device = await this.devicesService.createIfNotExist(createDeviceDto)

    const userHasDevice = await this.deviceMapService.checkUserHasDevice(
      user.id,
      device.id,
    )

    if (
      !userHasDevice &&
      !loginDto.emailOtp &&
      user.isAuthenticatorVerified &&
      !loginDto.authenticatorOtp
    ) {
      throw new BusinessException(
        LoginError.NEED_AUTHENTICATOR_OTP_AND_EMAIL_OTP,
      )
    }

    if (!userHasDevice && !loginDto.emailOtp) {
      throw new BusinessException(LoginError.NEED_EMAIL_OTP)
    }

    if (user.isAuthenticatorVerified && !loginDto.authenticatorOtp) {
      throw new BusinessException(LoginError.NEED_AUTHENTICATOR_OTP)
    }

    if (!userHasDevice) {
      await this.otpService.validateOtp(
        loginDto.emailOtp,
        `${user.id}-${deviceHash}`,
        EOtpBusiness.DEVICE_VERIFICATION_OTP,
        new BusinessException(LoginError.WRONG_EMAIL_OTP),
        user.id,
      )
    }

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.validateAuthenticatorOtp(
        loginDto.authenticatorOtp,
        user,
      )
    }

    this.redisQueueService.addUserLoginJob({
      userId: user.id,
      user,
      device,
      lang,
      ip,
      time: Date.now(),
    })

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.markUsedAuthenticatorOtp(
        user.id,
        loginDto.authenticatorOtp,
      )
    }

    await this.otpService.markUsedOtp(
      `${user.id}-${deviceHash}`,
      EOtpBusiness.DEVICE_VERIFICATION_OTP,
    )

    return {
      user: user,
      device: device,
    }
  }

  async sendDeviceVerificationOtp(
    sendDeviceVerificationOtpDto: SendDeviceVerificationOtpDto,
    deviceInfo: string,
    ip: string,
    lang: string,
  ) {
    const user = await this.usersService.getUserByEmail(
      sendDeviceVerificationOtpDto.email,
    )
    if (!user) {
      throw new BusinessException(LoginError.USER_DOES_NOT_EXIST)
    }

    // if (user.isAuthenticatorVerified) return new OtpResponseDto(true, 0)
    const parsedDeviceInfo = parseDeviceInfo(deviceInfo)

    const { otp, ttl, timeBlockResend } = await this.otpService.generateOtp(
      `${user.id}-${getDeviceHashFromDeviceInfo(parsedDeviceInfo)}`,
      EOtpBusiness.DEVICE_VERIFICATION_OTP,
    )

    await this.notificationService.sendMail({
      userIds: [user.id],
      mailCommand: {
        lang,
        template: MailTemplate.AUTHORIZE_NEW_DEVICE,
      },
      data: JSON.stringify({
        ip,
        otp,
        ttl,
        time: currentTime(),
        os: getOSFromDeviceInfo(parsedDeviceInfo),
        browser: getBrowserFromDeviceInfo(parsedDeviceInfo),
      }),
    })
    return new OtpResponseDto(true, timeBlockResend)
  }
}
