import { Expose } from 'class-transformer'

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
