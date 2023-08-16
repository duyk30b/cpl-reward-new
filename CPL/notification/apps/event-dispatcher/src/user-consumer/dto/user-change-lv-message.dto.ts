import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserChangeLvMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'old_level' })
  @IsNotEmpty()
  oldLevel: number

  @Expose({ name: 'new_level' })
  @IsNotEmpty()
  newLevel: number
}

export class UserChangeLvMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserChangeLvMessageDataDto)
  data: UserChangeLvMessageDataDto
}
