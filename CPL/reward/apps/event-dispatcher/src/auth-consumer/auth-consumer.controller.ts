import { KafkaTopic, KAFKA_EVENTS, MessageId } from '@lib/kafka'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { AuthConsumerService } from './auth-consumer.service'
import { UserAuthenticatorStatusUpdatedDto } from './dto/user-authenticator-status-updated.dto'
import { UserChangeEmailDto } from './dto/user-change-email.dto'
import { UserChangeInfoDto } from './dto/user-change-info.dto'
import { UserChangeLvDto } from './dto/user-change-lv.dto'
import { UserChangePasswordDto } from './dto/user-change-password.dto'
import { UserCreateDto } from './dto/user-create.dto'
import { UserKycAutoKycFinishedDto } from './dto/user-kyc-auto-kyc-finished.dto'
import { UserKycRegisteredDto } from './dto/user-kyc-registered.dto'
import { UserKycStatusUpdatedDto } from './dto/user-kyc-status-updated..dto'
import { UserLoginDto } from './dto/user-login.dto'
import { UserLogoutDto } from './dto/user-logout.dto'

@Controller()
export class AuthConsumerController {
  constructor(private readonly authConsumerService: AuthConsumerService) {}

  // @KafkaTopic(KAFKA_EVENTS.AUTH_USER_AUTHENTICATOR_STATUS_UPDATED)
  // async handleUserAuthenticatorStatusUpdate(
  //   @Payload('value') message: UserAuthenticatorStatusUpdatedDto,
  //   @MessageId() messageId: string,
  // ) {
  //   await this.authConsumerService.handleAuthMessageResult({
  //     userId: message.data.userId,
  //     messageId,
  //     eventName: KAFKA_EVENTS.AUTH_USER_AUTHENTICATOR_STATUS_UPDATED,
  //     data: message.data,
  //     createTime: message.createTime,
  //   })
  // }

  // @KafkaTopic(KAFKA_EVENTS.AUTH_USER_CHANGE_EMAIL)
  // async handleUserChangeEmail(
  //   @Payload('value') message: UserChangeEmailDto,
  //   @MessageId() messageId: string,
  // ) {
  //   await this.authConsumerService.handleAuthMessageResult({
  //     userId: message.data.userId,
  //     messageId,
  //     eventName: KAFKA_EVENTS.AUTH_USER_CHANGE_EMAIL,
  //     data: message.data,
  //     createTime: message.createTime,
  //   })
  // }

  @KafkaTopic(KAFKA_EVENTS.AUTH_USER_CHANGE_INFO)
  async handleUserChangeInfo(
    @Payload('value') message: UserChangeInfoDto,
    @MessageId() messageId: string,
  ) {
    await this.authConsumerService.handleAuthMessageResult({
      userId: message.data.userId,
      messageId,
      eventName: KAFKA_EVENTS.AUTH_USER_CHANGE_INFO,
      data: message.data,
      createTime: message.createTime,
    })
  }

  @KafkaTopic(KAFKA_EVENTS.AUTH_USER_CHANGE_LV)
  async handleUserChangeLv(
    @Payload('value') message: UserChangeLvDto,
    @MessageId() messageId: string,
  ) {
    await this.authConsumerService.handleAuthMessageResult({
      userId: message.data.userId,
      messageId,
      eventName: KAFKA_EVENTS.AUTH_USER_CHANGE_LV,
      data: message.data,
      createTime: message.createTime,
    })
  }

  // @KafkaTopic(KAFKA_EVENTS.AUTH_USER_CHANGE_PASSWORD)
  // async handleUserChangePassword(
  //   @Payload('value') message: UserChangePasswordDto,
  //   @MessageId() messageId: string,
  // ) {
  //   await this.authConsumerService.handleAuthMessageResult({
  //     userId: message.data.userId,
  //     messageId,
  //     eventName: KAFKA_EVENTS.AUTH_USER_CHANGE_PASSWORD,
  //     data: message.data,
  //     createTime: message.createTime,
  //   })
  // }

  @KafkaTopic(KAFKA_EVENTS.AUTH_USER_CREATED)
  async handleUserCreate(@Payload('value') message: UserCreateDto, @MessageId() messageId: string) {
    await this.authConsumerService.handleAuthMessageResult({
      userId: message.data.id,
      messageId,
      eventName: KAFKA_EVENTS.AUTH_USER_CREATED,
      data: message.data,
      createTime: message.createTime,
    })
  }

  @KafkaTopic(KAFKA_EVENTS.AUTH_USER_KYC_AUTO_KYC_FINISHED)
  async handleUserKycAutoKycFinished(
    @Payload('value') message: UserKycAutoKycFinishedDto,
    @MessageId() messageId: string,
  ) {
    await this.authConsumerService.handleAuthMessageResult({
      userId: message.data.userId,
      messageId,
      eventName: KAFKA_EVENTS.AUTH_USER_KYC_AUTO_KYC_FINISHED,
      data: message.data,
      createTime: message.createTime,
    })
  }

  @KafkaTopic(KAFKA_EVENTS.AUTH_USER_KYC_REGISTERED)
  async handleUserKycRegister(
    @Payload('value') message: UserKycRegisteredDto,
    @MessageId() messageId: string,
  ) {
    await this.authConsumerService.handleAuthMessageResult({
      userId: message.data.userId,
      messageId,
      eventName: KAFKA_EVENTS.AUTH_USER_KYC_REGISTERED,
      data: message.data,
      createTime: message.createTime,
    })
  }

  @KafkaTopic(KAFKA_EVENTS.AUTH_USER_KYC_STATUS_UPDATED)
  async handleUserKycStatusUpdated(
    @Payload('value') message: UserKycStatusUpdatedDto,
    @MessageId() messageId: string,
  ) {
    await this.authConsumerService.handleAuthMessageResult({
      userId: message.data.userId,
      messageId,
      eventName: KAFKA_EVENTS.AUTH_USER_KYC_STATUS_UPDATED,
      data: message.data,
      createTime: message.createTime,
    })
  }

  @KafkaTopic(KAFKA_EVENTS.AUTH_USER_LOGIN)
  async handleUserLogin(@Payload('value') message: UserLoginDto, @MessageId() messageId: string) {
    await this.authConsumerService.handleAuthMessageResult({
      userId: message.data.userId,
      messageId,
      eventName: KAFKA_EVENTS.AUTH_USER_LOGIN,
      data: message.data,
      createTime: message.createTime,
    })
  }

  // @KafkaTopic(KAFKA_EVENTS.AUTH_USER_LOGOUT)
  // async handleUserLogout(@Payload('value') message: UserLogoutDto, @MessageId() messageId: string) {
  //   await this.authConsumerService.handleAuthMessageResult({
  //     userId: message.data.userId,
  //     messageId,
  //     eventName: KAFKA_EVENTS.AUTH_USER_LOGOUT,
  //     data: message.data,
  //     createTime: message.createTime,
  //   })
  // }
}
