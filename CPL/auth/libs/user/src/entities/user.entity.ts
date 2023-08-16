import { MyBaseEntity, TransformInt } from '@lib/util'
import { Exclude, Expose } from 'class-transformer'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import validator from 'validator'
import {
  UserAuthenticatorVerifyStatus,
  UserEmailVerifyStatus,
  UserKycVerifyStatus,
  UserPasswordEncryptor,
  UserStatus,
  UserType,
} from '../enum/user.enum'

@Entity()
export class User extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Index('INDEX_UUID', { unique: true })
  @Column()
  @Expose()
  uuid: string

  @Column({ nullable: true })
  @Expose()
  name: string

  @Column({ nullable: true })
  @Expose()
  phone: string

  @Expose({ name: 'phone_country' })
  @Column({ nullable: true, name: 'phone_country' })
  phoneCountry: string

  @Column({ nullable: true })
  @Expose()
  email: string

  @Column({ nullable: true, select: false })
  @Exclude()
  password: string

  @Column({
    default: UserPasswordEncryptor.AUTH,
    nullable: false,
    name: 'password_encryptor',
  })
  @Exclude()
  passwordEncryptor: number

  @Column({ select: false })
  @Exclude()
  salt: string

  @Index('INDEX_FB_ID')
  @Expose({ name: 'fb_id' })
  @Column({ nullable: true, name: 'fb_id' })
  fbId: string

  @Index('INDEX_GG_ID')
  @Expose({ name: 'gg_id' })
  @Column({ nullable: true, name: 'gg_id' })
  ggId: string

  @Index('INDEX_APPLE_ID')
  @Expose({ name: 'apple_id' })
  @Column({ nullable: true, name: 'apple_id' })
  appleId: string

  @Column({ default: '' })
  checkpoint: string

  @Expose({ name: 'phone_verify_at' })
  @Column({
    default: null,
    nullable: true,
    name: 'phone_verify_at',
  })
  @TransformInt()
  phoneVerifyAt: number

  @Column({ default: UserStatus.ACTIVE })
  @Expose()
  status: number

  @Expose({ name: 'referrer_code' })
  @Column({
    default: null,
    nullable: true,
    name: 'referrer_code',
  })
  referrerCode: string

  @Expose({ name: 'dynamic_link' })
  @Column({
    default: null,
    nullable: true,
    name: 'dynamic_link',
  })
  dynamicLink: string

  @Expose({ name: 'referred_by_id' })
  @Column({
    default: null,
    nullable: true,
    name: 'referred_by_id',
  })
  referredById: string

  @Expose({ name: 'last_login' })
  @Column({
    default: null,
    nullable: true,
    name: 'last_login',
  })
  @TransformInt()
  lastLogin: number

  @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL })
  @Expose()
  type: UserType

  @Expose({ name: 'email_verify_at' })
  @Column({
    default: null,
    nullable: true,
    name: 'email_verify_at',
  })
  @TransformInt()
  emailVerifyAt: number

  @Expose({ name: 'email_verify_status' })
  @Column({
    name: 'email_verify_status',
    default: UserEmailVerifyStatus.UNVERIFIED,
  })
  emailVerifyStatus: number

  @Expose({ name: 'authenticator_verify_at' })
  @Column({
    default: null,
    nullable: true,
    name: 'authenticator_verify_at',
  })
  @TransformInt()
  authenticatorVerifyAt: number

  @Expose({ name: 'authenticator_verify_status' })
  @Column({
    name: 'authenticator_verify_status',
    default: UserAuthenticatorVerifyStatus.UNVERIFIED,
  })
  authenticatorVerifyStatus: number

  @Expose({ name: 'kyc_verify_status' })
  @Column({
    name: 'kyc_verify_status',
    default: UserKycVerifyStatus.UNVERIFIED,
  })
  kycVerifyStatus: number

  @Expose({ name: 'bce_updated_at' })
  @Column({ name: 'bce_updated_at', default: null })
  @TransformInt()
  bceUpdatedAt: number

  @Exclude()
  @Column({ nullable: true, name: 'otp_secret', select: false })
  otpSecret: string

  @Expose({ name: 'user_info_status' })
  @Column({ name: 'user_info_status' })
  userInfoStatus: number

  @Expose({ name: 'last_password_change' })
  @Column({ name: 'last_password_change' })
  @TransformInt()
  lastPasswordChange: number

  @Expose({ name: 'accept_law_status' })
  @Column({ name: 'accept_law_status' })
  acceptLawStatus: number

  @Expose({ name: 'account_lv' })
  @Column({ name: 'account_lv' })
  accountLv: number

  @Expose({ name: 'channel_id' })
  @Column({
    default: null,
    nullable: true,
    name: 'channel_id',
  })
  channelId: number

  @Expose({ name: 'request_delete_at' })
  @Column({ nullable: true, name: 'request_delete_at' })
  @TransformInt()
  requestDeleteAt: number

  @Column({ name: 'is_banned', type: 'boolean' })
  @Expose({ name: 'is_banned' })
  isBanned: boolean

  // Lấy email để gửi hiển thị. Nếu user chưa đăng ký email thì tìm email hợp lệ trong các field có thể chứa email
  getEmailForDisplay() {
    if (this.email) return this.email
    if (this.fbId && validator.isEmail(this.fbId)) return this.fbId
    if (this.ggId && validator.isEmail(this.ggId)) return this.ggId
    return null
  }

  get isAuthenticatorVerified() {
    return (
      this.authenticatorVerifyStatus == UserAuthenticatorVerifyStatus.VERIFIED
    )
  }

  set isAuthenticatorVerified(value: boolean) {
    this.authenticatorVerifyAt = value ? new Date().getTime() : null
    this.authenticatorVerifyStatus = value
      ? UserAuthenticatorVerifyStatus.VERIFIED
      : UserAuthenticatorVerifyStatus.UNVERIFIED
  }
}
