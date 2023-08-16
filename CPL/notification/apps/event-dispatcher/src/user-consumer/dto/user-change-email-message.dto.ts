import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserChangeEmailMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'old_email' })
  oldEmail: string

  @Expose({ name: 'new_email' })
  @IsNotEmpty()
  newEmail: string
}

export class UserChangeEmailMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserChangeEmailMessageDataDto)
  data: UserChangeEmailMessageDataDto
}
