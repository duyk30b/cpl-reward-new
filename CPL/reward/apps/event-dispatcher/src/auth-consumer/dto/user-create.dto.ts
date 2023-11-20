import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsEmail, IsNumber, IsString, ValidateNested } from 'class-validator'

class UserCreateData {
  @Expose({ name: 'last_login' })
  @IsNumber()
  lastLogin: number

  @Expose()
  @IsEmail()
  email: string

  @Expose({ name: 'email_verify_at' })
  @IsNumber()
  emailVerifyAt: number

  @Expose({ name: 'created_at' })
  @IsNumber()
  createdAt: number

  // @Expose({ name: 'updated_at' })
  // @IsNumber()
  // updatedAt: number

  @Expose({ name: 'id' })
  @IsString()
  id: string

  @Expose({ name: 'status' })
  @IsNumber()
  status: number

  @Expose({ name: 'type' })
  @IsNumber()
  type: number

  @Expose({ name: 'email_verify_status' })
  @IsNumber()
  emailVerifyStatus: number

  @Expose({ name: 'referred_by_id' })
  @IsString()
  referredById: number

  @Expose({ name: 'channel_id' })
  @Type(() => Number)
  @IsNumber()
  channelId: number
}

export class UserCreateDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserCreateData)
  data: UserCreateData
}

// Example:
// {
//   "data": {
//     "created_at": 1673834917495,
//     "updated_at": 1673834920780,
//     "id": "67690",
//     "uuid": "f14f007a-8d03-415a-8aba-722004d018e7",
//     "email": "okuda-emi+newkycfb1noko01@blitz-marketing.co.jp",
//     "status": 1,
//     "referrer_code": "Lk6Q9HOYff",
//     "dynamic_link": "https://link.staging-bitcastle.work/5VEZ",
//     "referred_by_id": "67225",
//     "last_login": 1673834917363,
//     "type": 1,
//     "email_verify_at": 1673834917434,
//     "email_verify_status": 1,
//     "authenticator_verify_status": 2,
//     "kyc_verify_status": 2,
//     "user_info_status": 2,
//     "accept_law_status": 2,
//     "account_lv": 2,
//     "is_banned": false
//   },
//   "create_time": 1673834920794,
//   "version": 1
// }
