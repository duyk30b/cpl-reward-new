import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserChangePasswordMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'is_reset' })
  isReset: boolean
}

export class UserChangePasswordMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserChangePasswordMessageDataDto)
  data: UserChangePasswordMessageDataDto
}
