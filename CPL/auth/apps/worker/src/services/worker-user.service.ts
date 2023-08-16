import { Injectable, Logger } from '@nestjs/common'
import { UserKycHistoryService, UserKycService } from '@lib/user-kyc'
import { UserEmailService } from '@lib/user-email'
import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { KycProviderService } from '@lib/kyc-provider'
import { plainToClass } from 'class-transformer'
import {
  getBrowserFromDeviceInfo,
  getOSFromDeviceInfo,
  parseDeviceInfo,
  SocketEvent,
  UserEvent,
} from '@lib/util'
import { KafkaService } from '@lib/kafka'
import { UserInfoService, UserService } from '@lib/user'
import { UserSettingService } from '@lib/user-setting'
import { AuthUserSettingService } from '@lib/user/services/auth-user-setting.service'
import {
  IUserBanEvent,
  UserBanEvent,
  IUserUnbanEvent,
  UserUnbanEvent,
  IUserCreatedEvent,
  IUserAuthenticatorStatusUpdatedEvent,
  UserAuthenticatorStatusUpdatedEvent,
  IUserLoginEvent,
  IUserLogoutEvent,
  UserLogoutEvent,
  UserChangeEmailEvent,
  IUserChangeEmailEvent,
  IUserChangeLvEvent,
  UserChangeLvEvent,
  IUserChangeInfoEvent,
  UserChangeInfoEvent,
  IUserChangePasswordEvent,
  UserChangePasswordEvent,
  IUserProactivelyLogoutEvent,
  IUserDeleteAccountEvent,
  UserDeleteAccountEvent,
  IUserUpdatedEvent,
  IUserRequestDeleteAccountEvent,
  UserRequestDeleteAccountEvent,
} from '@lib/redis-queue'
import { WebsocketService } from '@lib/websocket'
import { DeviceMapService, DeviceService } from '@lib/device'
import { LoginHistoryService } from '@lib/login-history'
import { EmailCheckLogService } from '@lib/user-email/services/email-check-log.service'
import { EmailChangeHistoryService } from '@lib/email-change-history'
import { Device } from '@lib/device/entities/device.entity'

@Injectable()
export class WorkerUserService {
  private readonly logger = new Logger(WorkerUserService.name)

  constructor(
    private readonly userKycHistoryService: UserKycHistoryService,
    private readonly kycProviderService: KycProviderService,
    private readonly userEmailService: UserEmailService,
    private readonly kafkaService: KafkaService,
    private readonly userService: UserService,
    private readonly authUserSettingService: AuthUserSettingService,
    private readonly userSettingService: UserSettingService,
    private readonly websocketService: WebsocketService,
    private readonly loginHistoryService: LoginHistoryService,
    private readonly deviceMapService: DeviceMapService,
    private readonly emailCheckLogService: EmailCheckLogService,
    private readonly emailChangeHistoryService: EmailChangeHistoryService,
    private readonly deviceService: DeviceService,
    private readonly userInfoService: UserInfoService,
    private readonly userKycService: UserKycService,
  ) {}

  async handleUserRequestDeleteAccount(data: IUserRequestDeleteAccountEvent) {
    const event = plainToClass(UserRequestDeleteAccountEvent, data, {
      ignoreDecorators: true,
    })
    this.kafkaService.sendWithTopicFromConfig(
      UserEvent.REQUEST_DELETE_ACCOUNT,
      event,
    )
  }

  async handleUserDeleteAccount(data: IUserDeleteAccountEvent) {
    const { userId } = data
    const event = plainToClass(UserDeleteAccountEvent, data, {
      ignoreDecorators: true,
    })
    this.kafkaService.sendWithTopicFromConfig(UserEvent.DELETE_ACCOUNT, event)
    this.logger.log('Process delete for user ' + userId)
    await this.userEmailService.deleteUser(userId)

    const kycHistories = await this.userKycHistoryService.getListUserKycHistory(
      userId,
    )

    const promises = kycHistories.map((history) =>
      this.removeFaceIndexInKycHistory(history),
    )
    await Promise.all(promises)
  }

  async handleUserBan(data: IUserBanEvent) {
    const event = plainToClass(UserBanEvent, data, { ignoreDecorators: true })
    this.kafkaService.sendWithTopicFromConfig(UserEvent.BAN, event)
  }

  async handleUserUnban(data: IUserUnbanEvent) {
    const event = plainToClass(UserUnbanEvent, data, { ignoreDecorators: true })
    this.kafkaService.sendWithTopicFromConfig(UserEvent.UNBAN, event).then()
  }

  async handleUserCreated(data: IUserCreatedEvent) {
    const { userId, lang } = data
    const user = await this.userService.getUserById(userId)
    this.userEmailService.mapUserEmail(user)
    this.userSettingService.setLocale(user.id, lang)
    this.kafkaService.sendWithTopicFromConfig(UserEvent.CREATED, user)
    this.authUserSettingService.createDefaultSettingForUser(user.id)
  }

  async handleAuthenticatorStatusUpdated(
    data: IUserAuthenticatorStatusUpdatedEvent,
  ) {
    const event = plainToClass(UserAuthenticatorStatusUpdatedEvent, data, {
      ignoreDecorators: true,
    })
    this.kafkaService.sendWithTopicFromConfig(
      UserEvent.AUTHENTICATOR_STATUS_UPDATED,
      event,
    )
    this.websocketService.publish(event.userId, {
      event: SocketEvent.USER_UPDATED,
      data: {
        authenticator_verify_status: event.status,
      },
    })
  }

  async handleUserLogin(data: IUserLoginEvent) {
    const { user, device, lang, ip, isRegister, time } = data

    this.websocketService.publish(data.device.deviceHash, {
      event: SocketEvent.USER_LOGIN,
      userId: user.id,
    })

    await this.deviceMapService.addDeviceToUser({
      userId: user.id,
      deviceId: device.id,
      lastLogin: time,
      lastIp: ip,
    })

    await this.userService.logout(user.id, device.id, time, true)

    await this.userService.updateLastLogin(user, time)

    const deviceInfo = parseDeviceInfo(device.deviceInfo)
    await this.loginHistoryService.create({
      userId: user.id,
      deviceId: device.id,
      ip,
      browser: getBrowserFromDeviceInfo(deviceInfo),
      os: getOSFromDeviceInfo(deviceInfo),
    })

    if (!isRegister) {
      await this.userSettingService.setLocale(user.id, lang)
    }

    this.kafkaService.sendWithTopicFromConfig(UserEvent.LOGIN, {
      user_id: user.id,
      device: plainToClass(Device, device, { ignoreDecorators: true }),
      lang,
      ip,
      is_register: isRegister,
      time,
    })

    this.websocketService.publish(user.id, {
      event: SocketEvent.USER_UPDATED,
      data: {
        last_login: time,
      },
    })
  }

  async handleUserLogout(data: IUserLogoutEvent) {
    const event = plainToClass(UserLogoutEvent, data, {
      ignoreDecorators: true,
    })
    this.kafkaService.sendWithTopicFromConfig(UserEvent.LOGOUT, event).then()
  }

  async handleUserChangeEmail(data: IUserChangeEmailEvent) {
    const event = plainToClass(UserChangeEmailEvent, data, {
      ignoreDecorators: true,
    })
    this.emailChangeHistoryService.saveHistory(event)
    this.userEmailService.saveUserEmail(event.userId, event.newEmail)
    this.kafkaService.sendWithTopicFromConfig(UserEvent.CHANGE_EMAIL, event)

    this.websocketService.publish(event.userId, {
      event: SocketEvent.USER_UPDATED,
      data: {
        email: event.newEmail,
      },
    })
  }

  async handleUserChangeLv(data: IUserChangeLvEvent) {
    const event = plainToClass(UserChangeLvEvent, data, {
      ignoreDecorators: true,
    })
    this.kafkaService.sendWithTopicFromConfig(UserEvent.CHANGE_LV, event)

    this.websocketService.publish(event.userId, {
      event: SocketEvent.USER_UPDATED,
      data: {
        account_lv: event.newLevel,
      },
    })
  }

  async handleUserChangeInfo(data: IUserChangeInfoEvent) {
    const event = plainToClass(UserChangeInfoEvent, data, {
      ignoreDecorators: true,
    })
    const { userId } = event
    this.kafkaService.sendWithTopicFromConfig(UserEvent.CHANGE_INFO, event)
    const info = await this.userInfoService.getInfoByUserId(userId)

    const userKyc = await this.userKycService.getKycByUserId(userId)
    if (userKyc) {
      await this.userKycService.updateUserKyc(userKyc.id, {
        countryId: info.countryId,
      })
    }

    this.websocketService.publish(event.userId, {
      event: SocketEvent.USER_UPDATED,
      data: {
        nationality_id: info.nationalityId,
      },
    })
  }

  async handleUserChangePassword(data: IUserChangePasswordEvent) {
    const event = plainToClass(UserChangePasswordEvent, data, {
      ignoreDecorators: true,
    })
    this.kafkaService.sendWithTopicFromConfig(UserEvent.CHANGE_PASSWORD, event)
  }

  async handleUserProactivelyLogout(data: IUserProactivelyLogoutEvent) {
    const { deviceId, userId } = data
    const device = await this.deviceService.getDeviceById(deviceId)

    this.websocketService.publish(device.deviceHash, {
      event: SocketEvent.USER_LOGOUT,
      userId: userId,
    })
  }

  async handleUserUpdated(data: IUserUpdatedEvent) {
    const { userId, change } = data

    this.websocketService.publish(userId, {
      event: SocketEvent.USER_UPDATED,
      data: change,
    })
  }

  private async removeFaceIndexInKycHistory(history: UserKycHistory) {
    const promises = history.imageProviders.map((provider) => {
      const imageProvider = this.kycProviderService.getImageProvider(provider)
      if (!imageProvider) return null
      return imageProvider.deleteFaceIndex(history)
    })

    await Promise.all(promises)
  }
}
