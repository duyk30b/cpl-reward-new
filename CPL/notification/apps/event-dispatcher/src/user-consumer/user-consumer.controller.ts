import { KafkaTopic, PayloadMessage } from '@libs/kafka'
import { EUserEvent, EUserKycEvent } from '@libs/common'
import { Controller } from '@nestjs/common'
import { UserLoginMessageDto } from './dto/user-login-message.dto'
import { UserConsumerService } from './user-consumer.service'
import { UserChangeEmailMessageDto } from './dto/user-change-email-message.dto'
import { UserKycRegisteredMessageDto } from './dto/user-kyc-registered-message.dto'
import { UserKycStatusUpdatedMessageDto } from './dto/user-kyc-status-updated-message.dto'
import { UserCreatedMessageDto } from './dto/user-created-message.dto'
import { UserChangeLvMessageDto } from './dto/user-change-lv-message.dto'
import { UserLogoutMessageDto } from './dto/user-logout-message.dto'
import { UserChangePasswordMessageDto } from './dto/user-change-password-message.dto'
import { UserDeleteAccountMessageDto } from './dto/user-delete-account-message.dto'
import { UserRequestDeleteAccountMessageDto } from './dto/user-request-delete-account-message.dto'

@Controller()
export class UserConsumerController {
  constructor(private readonly userConsumerService: UserConsumerService) {}

  @KafkaTopic(EUserEvent.CREATED)
  async handleUserCreated(@PayloadMessage() message: UserCreatedMessageDto) {
    await this.userConsumerService.handleUserCreated(message)
  }

  @KafkaTopic(EUserEvent.LOGIN)
  async handleUserLogin(@PayloadMessage() message: UserLoginMessageDto) {
    await this.userConsumerService.handleUserLogin(message)
  }

  @KafkaTopic(EUserEvent.LOGOUT)
  async handleUserLogout(@PayloadMessage() message: UserLogoutMessageDto) {
    await this.userConsumerService.handleUserLogout(message)
  }

  @KafkaTopic(EUserEvent.CHANGE_EMAIL)
  async handleUserChangeEmail(
    @PayloadMessage() message: UserChangeEmailMessageDto,
  ) {
    await this.userConsumerService.handleUserChangeEmail(message)
  }

  @KafkaTopic(EUserKycEvent.REGISTERED)
  async handleUserKycRegistered(
    @PayloadMessage() message: UserKycRegisteredMessageDto,
  ) {
    await this.userConsumerService.handleUserKycRegistered(message)
  }

  @KafkaTopic(EUserKycEvent.STATUS_UPDATED)
  async handleUserKycStatusUpdated(
    @PayloadMessage() message: UserKycStatusUpdatedMessageDto,
  ) {
    await this.userConsumerService.handleUserKycStatusUpdated(message)
  }

  @KafkaTopic(EUserEvent.CHANGE_LV)
  async handleUserChangeLv(@PayloadMessage() message: UserChangeLvMessageDto) {
    await this.userConsumerService.handleUserChangeLv(message)
  }

  @KafkaTopic(EUserEvent.CHANGE_PASSWORD)
  async handleUserChangePassword(
    @PayloadMessage() message: UserChangePasswordMessageDto,
  ) {
    await this.userConsumerService.handleUserChangePassword(message)
  }

  @KafkaTopic(EUserEvent.DELETE_ACCOUNT)
  async handleUserDeleteAccount(
    @PayloadMessage() message: UserDeleteAccountMessageDto,
  ) {
    await this.userConsumerService.handleUserDeleteAccount(message)
  }

  @KafkaTopic(EUserEvent.REQUEST_DELETE_ACCOUNT)
  async handleUserRequestDeleteAccount(
    @PayloadMessage() message: UserRequestDeleteAccountMessageDto,
  ) {
    await this.userConsumerService.handleUserRequestDeleteAccount(message)
  }
}
