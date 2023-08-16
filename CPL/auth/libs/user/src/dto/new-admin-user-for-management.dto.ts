import { Expose } from 'class-transformer'

export class NewAdminUserForManagementDto {
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

  @Expose({ name: 'referral_gg_id' })
  referralGgId: string

  @Expose({ name: 'referral_fb_id' })
  referralFbId: string

  @Expose({ name: 'referral_apple_id' })
  referralAppleId: string

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

  @Expose({ name: 'account_status' })
  accountStatus: number
}
