import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserKycRegisteredMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string
}

export class UserKycRegisteredMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserKycRegisteredMessageDataDto)
  data: UserKycRegisteredMessageDataDto
}
