import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'users' })
export class BceUser {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  name: string

  @Column()
  email: string

  // 1 là gửi OTP về mail, 2 là Authenticator, 3 là SMS
  @Column()
  security_level: number

  // Không dùng
  //@Column()
  //restrict_mode: string

  @Column()
  password: string

  // Không dùng vì tất cả = 1 hết
  //@Column()
  //fee_level: string

  // Map sang otp_secret
  @Column()
  google_authentication: string

  // Register đc là accepted_term rồi
  //@Column()
  //accepted_term: string

  // Value active / inactive. Đối với BOT, nếu bị xóa thì is_banned = 1 và status = inactive. Bị dừng thì chỉ inactive
  // Map sang cột bot_status
  @Column()
  status: string

  // Code để đi giới thiệu member khác
  @Column()
  referrer_code: string

  // user này đc giới thiệu bởi ID nào
  // Map sang referred_by_id
  @Column()
  referrer_id: string

  // Không dùng
  //@Column()
  //account_note: string

  @Column()
  last_login: number

  // Đối với BOT, nếu bị xóa thì is_banned = 1và status = inactive. Bị dừng thì chỉ inactive
  // Map sang bảng blacklist_users
  @Column()
  is_banned: boolean

  // Không dùng vì trùng với created_at
  //@Column()
  //registration_date: number

  // bot hoặc normal
  @Column()
  type: string

  // Migrate xong sẽ bỏ, cột này chỉ để đánh dấu user này login bằng FB, sang cột user sẽ fill email vào cột fb_email
  @Column()
  facebook_id: string

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date
}
