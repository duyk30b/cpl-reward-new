import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user_security_settings' })
export class BceUserSecuritySetting {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email_verified: boolean

  @Column()
  confirm_email_at: number

  @Column()
  phone_verified: boolean

  @Column()
  phone_verification_code: string

  @Column()
  otp_verified: boolean

  @Column()
  verify_otp_phone_at: Date

  @Column()
  google_auth_enabled_at: number
}
