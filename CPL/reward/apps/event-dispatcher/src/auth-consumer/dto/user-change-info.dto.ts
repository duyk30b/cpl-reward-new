import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, ValidateNested } from 'class-validator'

class UserChangeInfoData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string
}

export class UserChangeInfoDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserChangeInfoData)
  data: UserChangeInfoData
}

// Example:
// {
//   "data": {
//     "user_id": "67220"
//   },
//   "create_time": 1673826654345,
//   "version": 1
// }
