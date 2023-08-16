import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'

export class UserDeleteAccountMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  @IsOptional()
  email: string
}

export class UserDeleteAccountMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserDeleteAccountMessageDataDto)
  data: UserDeleteAccountMessageDataDto
}
