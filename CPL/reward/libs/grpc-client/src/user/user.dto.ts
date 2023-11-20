import { Expose, Type } from 'class-transformer'

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
  referredById: string

  @Expose({ name: 'last_login' })
  @Type(() => Number)
  lastLogin: number

  @Expose()
  type: string

  @Expose({ name: 'email_verify_at' })
  @Type(() => Number)
  emailVerifyAt: number

  @Expose({ name: 'authenticator_verify_at' })
  @Type(() => Number)
  authenticatorVerifyAt: number

  @Expose({ name: 'created_at' })
  @Type(() => Number)
  createdAt: number

  @Expose({ name: 'updated_at' })
  @Type(() => Number)
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

  @Expose({ name: 'apple_id' })
  appleId: string

  @Expose({ name: 'channel_id' })
  channelId: number

  @Expose({ name: 'last_password_change' })
  @Type(() => Number)
  lastPasswordChange: number
}
