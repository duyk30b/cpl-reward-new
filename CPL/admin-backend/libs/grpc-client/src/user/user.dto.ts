import { Expose, Type } from 'class-transformer'
import { TransformInt } from '@lib/util'
import { IBanUserReason } from '@lib/grpc-client/user/user.interface'

export class UserDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  phone: string

  @Expose({ name: 'phone_country' })
  phoneCountry: string

  @Expose()
  email: string

  @Expose({ name: 'fb_id' })
  fbId: string

  @Expose({ name: 'gg_id' })
  ggId: string

  @Expose({ name: 'phone_verify_at' })
  phoneVerifyAt: number

  @Expose()
  status: string

  @Expose({ name: 'referrer_code' })
  referrerCode: string

  @Expose({ name: 'referred_by_id' })
  referredById: number

  @Expose({ name: 'last_login' })
  lastLogin: number

  @Expose()
  type: string

  @Expose({ name: 'email_verify_at' })
  emailVerifyAt: number

  @Expose({ name: 'authenticator_verify_at' })
  authenticatorVerifyAt: number

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  updatedAt: number

  @Expose({ name: 'email_verify_status' })
  emailVerifyStatus: number

  @Expose({ name: 'authenticator_verify_status' })
  authenticatorVerifyStatus: number

  @Expose({ name: 'kyc_verify_status' })
  kycVerifyStatus: number

  @Expose({ name: 'user_info_status' })
  userInfoStatus: number

  @Expose({ name: 'account_lv' })
  accountLv: number

  @Expose({ name: 'is_banned' })
  isBanned?: number
}

export class UserForManagementDto {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'full_name' })
  fullName: string

  @Expose()
  email: string

  @Expose({ name: 'authenticator_verify_status' })
  authenticatorVerifyStatus: number

  @Expose({ name: 'user_info_status' })
  userInfoStatus: number

  @Expose({ name: 'account_lv' })
  accountLv: number

  @Expose({ name: 'gg_id' })
  ggId: string

  @Expose({ name: 'fb_id' })
  fbId: string

  @Expose({ name: 'apple_id' })
  appleId: string

  @Expose({ name: 'last_login' })
  lastLogin: number

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'risk_rating' })
  riskRating: number

  @Expose({ name: 'kyc_status' })
  kycStatus: number

  @Expose({ name: 'kyc_type' })
  kycType: number

  @Expose({ name: 'referral_email' })
  referralEmail: number

  @Expose({ name: 'is_banned' })
  isBanned: number

  @Expose({ name: 'level_status' })
  levelStatus: string

  @Expose({ name: 'social_link' })
  socialLink: number

  @Expose({ name: 'registered_channel' })
  registeredChannel: string

  @Expose({ name: 'kyc_submitted_date' })
  kycSubmittedDate: number

  @Expose({ name: 'referral_gg_id' })
  referralGgId: string

  @Expose({ name: 'referral_fb_id' })
  referralFbId: string

  @Expose({ name: 'referral_apple_id' })
  referralAppleId: string

  @Expose({ name: 'account_status' })
  accountStatus: number
}

export class BaseResponseDto {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class UsersExportDataDto {
  @Expose({ name: 'is_empty' })
  isEmpty: boolean

  @Expose()
  status: number

  @Expose()
  link: string

  @Expose({ name: 'created_at' })
  createdAt: string

  @Expose({ name: 'finished_at' })
  finishedAt: string
}

export class CreateUsersExportDataDto {
  @Expose({ name: 'finished_at' })
  success: boolean
}

export class UsersExportInfoDto extends BaseResponseDto {
  @Expose()
  @Type(() => UsersExportDataDto)
  data: UsersExportDataDto
}

export class CreateUsersExportInfoDto extends BaseResponseDto {
  @Expose()
  @Type(() => UsersExportDataDto)
  data: CreateUsersExportDataDto
}

export class UserForMarketingDto {
  @Expose({
    name: 'user_id',
  })
  userId: string

  @Expose({ name: 'full_name' })
  fullName: string

  @Expose()
  email: string

  @Expose({ name: 'account_lv' })
  accountLv: number

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'risk_rating' })
  riskRating: number

  @Expose({ name: 'referral_email' })
  referralEmail: number

  @Expose({ name: 'social_link' })
  socialLink: number

  @Expose({ name: 'channel_name' })
  channelName: string

  @Expose()
  tags: string[]
}

export class UserForHotWalletDto {
  @Expose({ name: 'user_id' })
  userId: number

  @Expose()
  email: string
}

export class UserBlacklistHistoryDto {
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  type: number

  @Expose()
  reasons: IBanUserReason[]

  @Expose({ name: 'created_at' })
  @TransformInt()
  createdAt: string
}
