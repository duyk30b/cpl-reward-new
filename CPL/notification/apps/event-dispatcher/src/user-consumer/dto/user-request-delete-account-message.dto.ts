import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserRequestDeleteAccountMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string
}

export class UserRequestDeleteAccountMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserRequestDeleteAccountMessageDataDto)
  data: UserRequestDeleteAccountMessageDataDto
}
