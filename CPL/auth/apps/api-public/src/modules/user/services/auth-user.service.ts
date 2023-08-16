import { AccessTokenService, RefreshTokenService } from '@lib/authorization'
import { BlacklistUserService } from '@lib/blacklist'
import { Device } from '@lib/device/entities/device.entity'
import {
  BOUnlimitedUserService,
  ExchangeUserUnlimitedService,
  MailTemplate,
  NotificationService,
} from '@lib/grpc-client'
import {
  AuthenticatorOtpService,
  EOtpBusiness,
  OtpResponseDto,
  OtpService,
} from '@lib/otp'
import { SafeUserService } from '@lib/safe-user'
import { UserInfoService, UserService } from '@lib/user'
import { UserKycService } from '@lib/user-kyc'
import { UserSettingService } from '@lib/user-setting'
import { User } from '@lib/user/entities/user.entity'
import { TutorialStatus, TutorialType } from '@lib/user/enum/user.enum'
import { AuthUserSettingService } from '@lib/user/services/auth-user-setting.service'
import {
  AddEmailError,
  BusinessException,
  ChangeEmailError,
  DeleteAccountError,
  limitTimePromise,
  VerifyAccountError,
} from '@lib/util'
import { Injectable } from '@nestjs/common'
import { classToPlain } from 'class-transformer'
import { BlackUserService } from 'libs/black-user/src/black-user.service'
import { UnlimitedUserService } from 'libs/unlimited-user/src/unlimited-user.service'
import appInfo from 'temp/app-info'
import { AddEmailAuthenticationDto } from '../dto/add-email-authentication.dto'
import { ChangeEmailDto } from '../dto/change-email.dto'
import { DeleteAccountDto } from '../dto/delete-account.dto'
import { SendChangeEmailOtpDto } from '../dto/send-change-email-otp.dto'

@Injectable()
export class AuthUserService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService,
    private readonly userKycService: UserKycService,
    private readonly notificationService: NotificationService,
    private readonly authenticatorOtpService: AuthenticatorOtpService,
    private readonly otpService: OtpService,
    private readonly blackUserService: BlackUserService,
    private readonly unlimitedUserService: UnlimitedUserService,
    private readonly authUserSettingService: AuthUserSettingService,
    private readonly safeUserService: SafeUserService,
    private readonly blacklistUserService: BlacklistUserService,
    private readonly userSettingService: UserSettingService,
    private readonly userInfoService: UserInfoService,
    private readonly exchangeUserUnlimitedService: ExchangeUserUnlimitedService,
    private readonly bOUnlimitedUserService: BOUnlimitedUserService,
  ) {}

  createUserToken(user: User, device: Device) {
    const accessTokenPayload = {
      appId: appInfo.appId,
      scopes: 'all',
      userId: user.id,
      deviceId: device.id,
    }

    const accessToken = this.accessTokenService.create(accessTokenPayload)

    const refreshTokenPayload = {
      appId: appInfo.appId,
      scopes: 'all',
      userId: user.id,
      deviceId: device.id,
    }

    const refreshToken = this.refreshTokenService.create(refreshTokenPayload)

    return { accessToken, refreshToken }
  }

  async addEmailAuthentication(
    userId: string,
    addEmailAuthenticationDto: AddEmailAuthenticationDto,
  ) {
    let user = await this.userService.getUserByIdWithPrivateField(userId)
    if (!user) {
      throw new BusinessException(AddEmailError.USER_DOES_NOT_EXIST)
    }
    if (user.email) {
      throw new BusinessException(AddEmailError.ALREADY_HAVE_AN_EMAIL)
    }

    const existingUserCheck = await this.userService.checkEmailExist(
      addEmailAuthenticationDto.email,
      userId,
    )
    if (existingUserCheck.exist) {
      throw new BusinessException(existingUserCheck.response)
    }

    await this.otpService.validateOtp(
      addEmailAuthenticationDto.otp,
      addEmailAuthenticationDto.email,
      EOtpBusiness.VERIFY_EMAIL,
      new BusinessException(VerifyAccountError.WRONG_OTP),
    )

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.validateAuthenticatorOtp(
        addEmailAuthenticationDto.authenticatorOtp,
        user,
      )
    }

    await this.userService.addEmailAuthentication(
      user,
      addEmailAuthenticationDto,
    )

    user = await this.userService.updateLv(userId, 2)

    await this.otpService.markUsedOtp(
      addEmailAuthenticationDto.email,
      EOtpBusiness.VERIFY_EMAIL,
    )

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.markUsedAuthenticatorOtp(
        user.id,
        addEmailAuthenticationDto.authenticatorOtp,
      )
    }

    return user
  }

  async sendChangeEmailOtpToCurrentEmail(userId: string, lang: string) {
    const user = await this.userService.getUserById(userId)
    if (!user.email) {
      throw new BusinessException(ChangeEmailError.USER_DOES_NOT_HAVE_EMAIL)
    }

    // If 2FA enabled, use authenticator code instead
    if (user.isAuthenticatorVerified) return

    const { otp, ttl, timeBlockResend } = await this.otpService.generateOtp(
      user.id,
      EOtpBusiness.CURRENT_EMAIL_OTP,
    )

    await this.notificationService.sendMail({
      userIds: [user.id],
      mailCommand: { template: MailTemplate.CONFIRM_CURRENT_EMAIL, lang },
      data: JSON.stringify({ otp, ttl }),
    })

    return new OtpResponseDto(true, timeBlockResend)
  }

  async sendChangeEmailOtpToNewEmail(
    userId: string,
    sendChangeEmailOtpDto: SendChangeEmailOtpDto,
    lang: string,
  ) {
    const user = await this.userService.getUserById(userId)
    if (!user.email) {
      throw new BusinessException(ChangeEmailError.USER_DOES_NOT_HAVE_EMAIL)
    }

    if (user.email == sendChangeEmailOtpDto.newEmail) {
      throw new BusinessException(ChangeEmailError.SAME_AS_CURRENT_EMAIL)
    }

    const existingUserCheck = await this.userService.checkEmailExist(
      sendChangeEmailOtpDto.newEmail,
      userId,
    )
    if (existingUserCheck.exist) {
      throw new BusinessException(existingUserCheck.response)
    }

    if (!lang) lang = await this.userSettingService.getLocale(userId)

    const { otp, ttl, timeBlockResend } = await this.otpService.generateOtp(
      sendChangeEmailOtpDto.newEmail,
      EOtpBusiness.NEW_EMAIL_OTP,
    )

    await this.notificationService.sendMail({
      emails: [sendChangeEmailOtpDto.newEmail],
      mailCommand: { template: MailTemplate.CONFIRM_NEW_EMAIL, lang },
      data: JSON.stringify({ otp, ttl }),
    })

    return new OtpResponseDto(true, timeBlockResend)
  }

  async changeEmail(userId: string, changeEmailDto: ChangeEmailDto) {
    const user = await this.userService.getUserByIdWithPrivateField(userId)
    if (!user.email) {
      throw new BusinessException(ChangeEmailError.USER_DOES_NOT_HAVE_EMAIL)
    }

    if (user.email == changeEmailDto.newEmail) {
      throw new BusinessException(ChangeEmailError.SAME_AS_CURRENT_EMAIL)
    }

    const existingUserCheck = await this.userService.checkEmailExist(
      changeEmailDto.newEmail,
      userId,
    )
    if (existingUserCheck.exist) {
      throw new BusinessException(existingUserCheck.response)
    }

    const passwordMatch = await this.userService.checkPasswordWithUserId(
      userId,
      changeEmailDto.password,
    )
    if (!passwordMatch) {
      throw new BusinessException(ChangeEmailError.WRONG_PASSWORD)
    }

    await this.otpService.validateOtp(
      changeEmailDto.newEmailOtp,
      changeEmailDto.newEmail,
      EOtpBusiness.NEW_EMAIL_OTP,
      new BusinessException(ChangeEmailError.WRONG_NEW_EMAIL_OTP),
    )

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.validateAuthenticatorOtp(
        changeEmailDto.authenticatorOtp,
        user,
      )
    } else {
      // await this.otpService.validateOtp(
      //   changeEmailDto.currentEmailOtp,
      //   user.id,
      //   EOtpBusiness.CURRENT_EMAIL_OTP,
      //   new BusinessException(ChangeEmailError.WRONG_CURRENT_EMAIL_OTP),
      // )
    }

    await this.userService.changeEmail(user, changeEmailDto.newEmail)

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.markUsedAuthenticatorOtp(
        user.id,
        changeEmailDto.authenticatorOtp,
      )
    } else {
      // await this.otpService.markUsedOtp(user.id, EOtpBusiness.CURRENT_EMAIL_OTP)
    }

    await this.otpService.markUsedOtp(
      changeEmailDto.newEmail,
      EOtpBusiness.NEW_EMAIL_OTP,
    )
  }

  async getCurrentUser(userId: string) {
    const [
      user,
      userKyc,
      ignoreUser,
      unlimitedExchange,
      unlimitedBO,
      safeUser,
      setting,
      userInfo,
    ] = await Promise.all([
      this.userService.getUserById(userId),
      this.userKycService.getKycByUserId(userId),
      this.blackUserService.getIgnoredUsers(userId),
      limitTimePromise(
        this.exchangeUserUnlimitedService.checkUserUnlimited(userId),
        5000,
        false,
      ),
      limitTimePromise(
        this.bOUnlimitedUserService.checkUserUnlimited(userId),
        5000,
        false,
      ),
      this.safeUserService.getByUserId(userId),
      this.authUserSettingService.getUserSetting(userId),
      this.userInfoService.getInfoByUserId(userId),
    ])

    const data = classToPlain(user)

    data.kyc_type = userKyc?.type

    data.exchange_tutorial_status =
      setting?.exchangeTutorialStatus || TutorialStatus.ON
    data.bo_tutorial_status = setting?.boTutorialStatus || TutorialStatus.ON

    data.is_ignored = ignoreUser ? true : false
    data.unlimited = {
      exchange: unlimitedExchange,
      high_low: unlimitedBO,
    }
    data.is_safe_user = safeUser ? true : false
    data.nationality_id = userInfo?.nationalityId
    return data
  }

  async getReferral(userId: string) {
    const count = await this.userService.countReferralByUserId(userId)

    return { referral: { count } }
  }

  async updateTutorialStatus(
    userId: string,
    type: TutorialType,
    status: TutorialStatus,
  ) {
    await this.authUserSettingService.updateTutorialStatus(userId, type, status)
  }

  async deleteAccount(userId: string, deleteAccountDto: DeleteAccountDto) {
    const user = await this.userService.getUserByIdWithPrivateField(userId)

    if (user.password) {
      const passwordMatched = this.userService.checkPasswordWithUser(
        user,
        deleteAccountDto.password,
      )
      if (!passwordMatched) {
        throw new BusinessException(DeleteAccountError.WRONG_PASSWORD)
      }
    }

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.validateAuthenticatorOtp(
        deleteAccountDto.authenticatorOtp,
        user,
      )
    }

    await this.userService.requestDeleteUser(userId)
    await this.userService.logoutAllDevices(userId)

    if (user.isAuthenticatorVerified) {
      await this.authenticatorOtpService.markUsedAuthenticatorOtp(
        userId,
        deleteAccountDto.authenticatorOtp,
      )
    }
  }

  async aggregateUserInfoForLogin(user: User) {
    const data = classToPlain(user)
    const userKyc = await this.userKycService.getKycByUserId(user.id)

    data.kyc_type = userKyc?.type
    return data
  }
}
