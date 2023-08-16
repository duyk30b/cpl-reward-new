import { Expose } from 'class-transformer'

export class User {
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
}

export enum UserEmailVerifyStatus {
  VERIFIED = 1,
  UNVERIFIED = 2,
}

export enum UserAuthenticatorVerifyStatus {
  VERIFIED = 1,
  UNVERIFIED = 2,
}

export enum UserKycVerifyStatus {
  VERIFIED = 1,
  UNVERIFIED = 2,
  PENDING = 3,
  REJECTED = 4,
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  PENDING_DELETE = 3,
}

export enum UserType {
  NORMAL = 1,
  BOT = 2,
}

export enum UserInfoStatus {
  UPDATED = 1,
  NOT_UPDATED = 2,
}

export enum AcceptLawStatus {
  ACCEPTED = 1,
  NOT_ACCEPTED = 2,
}

export const USER_SEARCH_FIELD_MAP = {
  email: 'email',
  full_name: 'full_name',
  referral_email: 'referral_email',
  gg_id: 'gg_id',
  fb_id: 'fb_id',
  apple_id: 'apple_id',
  referral_gg_id: 'referral_gg_id',
  referral_fb_id: 'referral_fb_id',
  referral_apple_id: 'referral_apple_id',
}
