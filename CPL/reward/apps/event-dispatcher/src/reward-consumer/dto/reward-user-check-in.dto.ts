import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, ValidateNested } from 'class-validator'

class RewardUserCheckInData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose({ name: 'created_at' })
  @IsNumber()
  createdAt: number
}

export class RewardUserCheckInDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => RewardUserCheckInData)
  data: RewardUserCheckInData
}

// Example:
// {
//   "data": {
//     "user_id": "41366",
//     "created_at": 1673834894
//   },
//   "create_time": 1673834894316,
//   "version": 1
// }
