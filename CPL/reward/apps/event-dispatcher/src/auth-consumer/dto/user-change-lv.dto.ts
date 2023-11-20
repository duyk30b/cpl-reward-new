import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, ValidateNested } from 'class-validator'

class UserChangeLvData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose({ name: 'old_level' })
  @IsNumber()
  oldLevel: number

  @Expose({ name: 'new_level' })
  @IsNumber()
  newLevel: number
}

export class UserChangeLvDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserChangeLvData)
  data: UserChangeLvData
}

// Example:
// {
//   "data": {
//     "user_id": "67689",
//     "old_level": 2,
//     "new_level": 3
//   },
//   "create_time": 1673840655208,
//   "version": 1
// }
