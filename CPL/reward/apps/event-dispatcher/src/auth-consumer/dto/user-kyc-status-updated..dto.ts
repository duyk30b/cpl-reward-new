import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, ValidateNested } from 'class-validator'

class UserKycStatusUpdatedData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose()
  @IsNumber()
  status: number

  @Expose({ name: 'old_status' })
  @IsNumber()
  oldStatus: number
}

export class UserKycStatusUpdatedDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserKycStatusUpdatedData)
  data: UserKycStatusUpdatedData
}

// Example:
// {
//   "data": {
//     "old_status": 2,
//     "status": 3,
//     "user_id": "67689"
//   },
//   "create_time": 1673840663369,
//   "version": 1
// }
