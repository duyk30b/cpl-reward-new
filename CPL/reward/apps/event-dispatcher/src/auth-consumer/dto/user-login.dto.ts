import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsBoolean, IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator'

class UserLoginData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose()
  @IsString()
  ip: string

  @Expose({ name: 'is_register' })
  @IsBoolean()
  isRegister: boolean

  @Expose({ name: 'time' })
  @IsNumber()
  time: number
}

export class UserLoginDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserLoginData)
  data: UserLoginData
}

// Example:
// {
//   "data": {
//     "user_id": "58737",
//     "device": {
//       "created_at": 1668477694419,
//       "updated_at": 1668477694419,
//       "id": "582",
//       "uuid": "750bc465-2671-4dcf-a530-863ed4825d39",
//       "device_hash": "9fef04f6d8cfa27c8b354d0fd6914892",
//       "device_info": {
//         "visitorId": "9fef04f6d8cfa27c8b354d0fd6914892",
//         "platform": {
//           "value": "Mac OS",
//           "duration": 0
//         },
//         "browserName": "Chrome",
//         "browserVersion": "107.0.0.0",
//         "timezone": {
//           "value": "Asia/Saigon",
//           "duration": 11
//         },
//         "screenResolution": {
//           "value": [
//             1920,
//             1080
//           ],
//           "duration": 0
//         },
//         "audio": {
//           "value": 124.04344968475198,
//           "duration": 5
//         }
//       }
//     },
//     "lang": "en",
//     "ip": "18.140.232.78",
//     "time": 1675306392095
//   },
//   "create_time": 1675306392267,
//   "version": 1
// }
