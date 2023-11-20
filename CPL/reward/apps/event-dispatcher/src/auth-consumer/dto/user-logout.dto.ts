import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator'

class UserLogoutData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose({ name: 'device_id' })
  @IsString()
  deviceId: string

  @Expose()
  @IsNumber()
  time: number
}

export class UserLogoutDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserLogoutData)
  data: UserLogoutData
}

// Example
// {
//   "data": {
//     "user_id": "41767",
//     "device_id": "1529",
//     "time": 1673506407747,
//     "by_login": true
//   },
//   "create_time": 1673506408252,
//   "version": 1
// }
