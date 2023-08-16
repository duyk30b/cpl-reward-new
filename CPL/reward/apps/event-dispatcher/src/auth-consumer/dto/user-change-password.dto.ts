import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, ValidateNested } from 'class-validator'

class UserChangePasswordData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string
}

export class UserChangePasswordDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserChangePasswordData)
  data: UserChangePasswordData
}

// Example:
// {
//   "data": {
//     "user_id": "67225"
//   },
//   "create_time": 1673846762180,
//   "version": 1
// }
