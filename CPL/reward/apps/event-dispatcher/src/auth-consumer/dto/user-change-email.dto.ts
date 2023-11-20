import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsEmail, ValidateNested } from 'class-validator'

export class UserChangeEmailData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose({ name: 'old_email' })
  oldEmail: string

  @Expose({ name: 'new_email' })
  @IsEmail()
  newEmail: string
}

export class UserChangeEmailDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserChangeEmailData)
  data: UserChangeEmailData
}
