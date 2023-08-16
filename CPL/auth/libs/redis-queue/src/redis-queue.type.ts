import { Device } from '@lib/device/entities/device.entity'
import { User } from '@lib/user/entities/user.entity'
import { Expose } from 'class-transformer'

export interface IUserAuthenticatorStatusUpdatedEvent {
  status: number
  userId: string
  otpSecret?: string
}

export class UserAuthenticatorStatusUpdatedEvent {
  status: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'otp_secret' })
  otpSecret?: string
}

export interface IUserChangeEmailEvent {
  userId: string
  oldEmail?: string
  newEmail: string
  isModifiedByUser: boolean
}

export class UserChangeEmailEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'old_email' })
  oldEmail: string

  @Expose({ name: 'new_email' })
  newEmail: string

  @Expose({ name: 'is_modified_by_user' })
  isModifiedByUser: boolean
}

export interface IUserChangeInfoEvent {
  userId: string
}

export class UserChangeInfoEvent {
  @Expose({ name: 'user_id' })
  userId: string
}

export interface IUserChangePasswordEvent {
  userId: string
  isReset?: boolean
}

export class UserChangePasswordEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'is_reset' })
  isReset: boolean
}

export interface IUserDeleteAccountEvent {
  userId: string
  email?: string
  newEmail?: string
}

export class UserDeleteAccountEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  email?: string

  @Expose({ name: 'new_email' })
  newEmail?: string
}

export interface IUserRequestDeleteAccountEvent {
  userId: string
}

export class UserRequestDeleteAccountEvent {
  @Expose({ name: 'user_id' })
  userId: string
}

export interface IUserKycRegisteredEvent {
  userId: string
}

export interface ISumsubApplicantPendingEvent {
  userId: string
  applicantType: string
}

export interface ISumsubApplicantReviewedEvent {
  userId: string
}

export interface IUserKycStatusUpdatedEvent {
  oldStatus: number
  status: number
  userId: string
}

export class UserKycStatusUpdatedEvent {
  @Expose({ name: 'old_status' })
  oldStatus: number

  @Expose()
  status: number

  @Expose({ name: 'user_id' })
  userId: string
}

export interface IUserChangeLvEvent {
  userId: string
  oldLevel: number
  newLevel: number
}

export class UserChangeLvEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'old_level' })
  oldLevel: number

  @Expose({ name: 'new_level' })
  newLevel: number
}

export interface IUserCreatedEvent {
  userId: string
  lang?: string
}

export class IUserLoginEvent {
  userId: string
  user: User
  device: Device
  lang: string
  ip: string
  isRegister?: boolean
  time: number
}

export interface IUserLogoutEvent {
  userId: string
  deviceId: string
  time: number
  byLogin: boolean
}

export class UserLogoutEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'device_id' })
  deviceId: string

  @Expose()
  time: number

  @Expose({ name: 'by_login' })
  byLogin: boolean
}

export interface IUserProactivelyLogoutEvent {
  userId: string
  deviceId: string
}

export class UserProactivelyLogoutEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'device_id' })
  deviceId: string
}

export interface IUserBanEvent {
  userId: string
  note?: string
  until?: number
  auto?: boolean
}

export class UserBanEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  note?: string

  @Expose()
  until?: number

  @Expose()
  auto?: boolean
}

export class IUserUnbanEvent {
  userId: string
}

export class UserUnbanEvent {
  @Expose({ name: 'user_id' })
  userId: string
}

export interface IAutoKycFinishedEvent {
  userId: string
  pass: boolean
}

export interface IKycDocumentApprovedEvent {
  userId: string
  userKycHistoryId: string
}

export class AutoKycFinishedEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  pass: boolean
}

export interface IUserUpdatedEvent {
  userId: string
  change: Record<string, any>
}
