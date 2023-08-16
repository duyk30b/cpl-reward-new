import {
  getBrowserFromDeviceInfo,
  getOSFromDeviceInfo,
  MailTemplate,
} from '@libs/common'
import { DeviceTokenService } from '@libs/device-token'
import { UserInfoService } from '@libs/grpc-client/user-info'
import { UserKycVerifyStatus } from '@libs/grpc-client/user/user.enum'
import { PersonalNotificationService } from '@libs/notification'
import { NotificationAggregateService } from '@libs/notification-aggregate'
import { BullQueueService } from '@libs/redis'
import { ESystemPushNotificationType } from '@libs/system-push-notification-setting'
import { UserSettingService } from '@libs/user-setting'
import { ACCOUNT_LV_PATH, LOGIN_PATH, timeWithFormat } from '@libs/util'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { I18nService } from 'nestjs-i18n'
import { UserChangeEmailMessageDto } from './dto/user-change-email-message.dto'
import { UserChangeLvMessageDto } from './dto/user-change-lv-message.dto'
import { UserChangePasswordMessageDto } from './dto/user-change-password-message.dto'
import { UserCreatedMessageDto } from './dto/user-created-message.dto'
import { UserKycRegisteredMessageDto } from './dto/user-kyc-registered-message.dto'
import { UserKycStatusUpdatedMessageDto } from './dto/user-kyc-status-updated-message.dto'
import { UserLoginMessageDto } from './dto/user-login-message.dto'
import { UserLogoutMessageDto } from './dto/user-logout-message.dto'
import { UserDeleteAccountMessageDto } from './dto/user-delete-account-message.dto'
import { UserRequestDeleteAccountMessageDto } from './dto/user-request-delete-account-message.dto'
import { Mt5Service } from '@libs/grpc-client/mt5'

@Injectable()
export class UserConsumerService {
  constructor(
    private readonly bullQueueService: BullQueueService,
    private readonly personalNotificationService: PersonalNotificationService,
    private readonly deviceTokenService: DeviceTokenService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    private readonly userInfoService: UserInfoService,
    private readonly notificationAggregateService: NotificationAggregateService,
    private readonly userSettingService: UserSettingService,
    private readonly mt5Service: Mt5Service,
  ) {}

  async handleUserCreated(message: UserCreatedMessageDto) {
    const data = message.data
    const { id: userId, createdAt, email, accountLv } = data
    const time = timeWithFormat(createdAt)
    const loginLink = `${this.configService.get(
      'global.frontend_link',
    )}${LOGIN_PATH}`
    const accountLvLink = `${this.configService.get(
      'global.frontend_link',
    )}${ACCOUNT_LV_PATH}`
    const mailData = { loginLink, accountLvLink, time, lv: accountLv }

    if (email) {
      this.bullQueueService.addMailCommand({
        userId,
        data: mailData,
        template: MailTemplate.UPGRADE_TO_ACCOUNT_LV_2,
      })
    }
  }

  async handleUserLogin(message: UserLoginMessageDto) {
    const data = message.data
    const { ip, userId, device, isRegister, time: loginTime } = data
    if (isRegister) return
    const time = timeWithFormat(loginTime)
    const deviceInfo = device.deviceInfo
    const os = getOSFromDeviceInfo(deviceInfo)
    const browser = getBrowserFromDeviceInfo(deviceInfo)
    const mailData = { ip, time, os, browser }
    // const title = await this.i18n.translate(`notification.LOGIN_NOTIFY`, {
    //   lang: 'en',
    //   args: mailData,
    // })
    // const content = await this.i18n.translate(
    //   `notification.LOGIN_NOTIFY_CONTENT`,
    //   {
    //     lang: 'en',
    //     args: mailData,
    //   },
    // )

    // const notification = await this.personalNotificationService.create({
    //   userId,
    //   message: {
    //     title,
    //     content,
    //     data: mailData,
    //   },
    //   notificationCategoryId: ENotificationCategory.SYSTEM,
    // })

    this.bullQueueService.addMailCommand({
      userId,
      data: mailData,
      template: MailTemplate.LOGIN_NOTIFY,
    })
  }

  async handleUserLogout(message: UserLogoutMessageDto) {
    const data = message.data
    const { userId, deviceId, time: logoutTime, byLogin } = data

    if (byLogin) return

    await this.deviceTokenService.deactiveTokenOfUserAndDevice(
      userId,
      deviceId,
      logoutTime,
    )
  }

  async handleUserChangeEmail(message: UserChangeEmailMessageDto) {
    const data = message.data
    const { oldEmail, newEmail, userId } = data
    const time = timeWithFormat(message.createTime)
    const mailData = { oldEmail, newEmail, time }

    if (!oldEmail) return

    const lang = await this.userSettingService.getLocale(userId)

    this.bullQueueService.addMailCommand({
      email: oldEmail,
      data: mailData,
      lang: lang,
      template: MailTemplate.CHANGE_EMAIL_ALERT,
    })

    const mt5AdminEmails = await this.mt5Service.getAdminEmails()
    mt5AdminEmails.forEach((email) => {
      this.bullQueueService.addMailCommand({
        email: email,
        data: mailData,
        template: MailTemplate.MT5_CHANGE_EMAIL_NOTIFY,
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleUserKycRegistered(message: UserKycRegisteredMessageDto) {
    // const data = message.data
    // const { userId } = data
    // const mailData = { userId }
    // this.bullQueueService.addMailCommand({
    //   userId: userId,
    //   data: mailData,
    //   template: MailTemplate.KYC_RECEIVED_DOCUMENT,
    // })
  }

  async handleUserKycStatusUpdated(message: UserKycStatusUpdatedMessageDto) {
    const { data, createTime } = message
    const { userId, oldStatus, status } = data

    if (status == UserKycVerifyStatus.PENDING) {
      // Case submit lại kyc sau khi bị reject
      if (oldStatus == UserKycVerifyStatus.REJECTED) {
        const mailData = { userId }

        this.bullQueueService.addMailCommand({
          userId: userId,
          data: mailData,
          template: MailTemplate.KYC_RECEIVED_DOCUMENT,
        })
      }
    } else if (status == UserKycVerifyStatus.REJECTED) {
      const time = timeWithFormat(createTime)
      const loginLink = `${this.configService.get(
        'global.frontend_link',
      )}${LOGIN_PATH}`
      const accountLvLink = `${this.configService.get(
        'global.frontend_link',
      )}${ACCOUNT_LV_PATH}`
      const userInfo = await this.userInfoService.findByUserId(userId)
      if (!userInfo) return

      const mailData = {
        userId,
        time,
        loginLink,
        accountLvLink,
        name: userInfo.fullName,
      }

      this.bullQueueService.addMailCommand({
        userId: userId,
        data: mailData,
        template: MailTemplate.KYC_REJECTED,
      })
    }

    if (status == UserKycVerifyStatus.REJECTED) {
      await this.notificationAggregateService.sendSystemNotificationToUser(
        userId,
        ESystemPushNotificationType.KYC_REJECTED,
        {},
        {
          kycStatus: status as unknown as string,
        },
      )
    } else if (status == UserKycVerifyStatus.VERIFIED) {
      await this.notificationAggregateService.sendSystemNotificationToUser(
        userId,
        ESystemPushNotificationType.KYC_ACCEPTED,
        {},
        {
          type: 'trading',
        },
      )
    }
  }

  async handleUserChangeLv(message: UserChangeLvMessageDto) {
    const { data, createTime } = message
    const { userId, oldLevel, newLevel } = data

    if (newLevel <= oldLevel) return

    const time = timeWithFormat(createTime)
    const loginLink = `${this.configService.get(
      'global.frontend_link',
    )}${LOGIN_PATH}`
    const accountLvLink = `${this.configService.get(
      'global.frontend_link',
    )}${ACCOUNT_LV_PATH}`
    const userInfo = await this.userInfoService.findByUserId(userId)

    if (newLevel == 5) {
      if (oldLevel != 3) return
      const mailData = {
        loginLink,
        accountLvLink,
        time,
        name: userInfo?.fullName,
        lv: 4,
      }
      this.bullQueueService.addMailCommand({
        userId,
        data: mailData,
        template: MailTemplate[`UPGRADE_TO_ACCOUNT_LV_4`],
      })
    } else {
      const mailData = {
        loginLink,
        accountLvLink,
        time,
        name: userInfo?.fullName,
        lv: newLevel,
      }
      this.bullQueueService.addMailCommand({
        userId,
        data: mailData,
        template: MailTemplate[`UPGRADE_TO_ACCOUNT_LV_${newLevel}`],
      })
    }
  }

  async handleUserChangePassword(message: UserChangePasswordMessageDto) {
    const data = message.data
    const { userId } = data
    const time = timeWithFormat(message.createTime)
    const mailData = { time }

    this.bullQueueService.addMailCommand({
      userId,
      data: mailData,
      template: MailTemplate.CHANGE_PASSWORD_ALERT,
    })
  }

  async handleUserDeleteAccount(message: UserDeleteAccountMessageDto) {
    // const data = message.data
    // const { userId, email } = data
    // if (!email) return
    // const userInfo = await this.userInfoService.findByUserId(userId)
    // const mailData = {
    //   userId,
    //   fullName: userInfo?.fullName,
    //   firstName: userInfo?.firstName,
    // }
    // this.bullQueueService.addMailCommand({
    //   email,
    //   data: mailData,
    //   template: MailTemplate.USER_DELETE_ACCOUNT,
    // })
  }

  async handleUserRequestDeleteAccount(
    message: UserRequestDeleteAccountMessageDto,
  ) {
    const data = message.data
    const { userId } = data

    const userInfo = await this.userInfoService.findByUserId(userId)

    const mailData = {
      userId,
      fullName: userInfo?.fullName,
      firstName: userInfo?.firstName,
    }

    this.bullQueueService.addMailCommand({
      userId,
      data: mailData,
      template: MailTemplate.USER_DELETE_ACCOUNT,
    })
  }
}
