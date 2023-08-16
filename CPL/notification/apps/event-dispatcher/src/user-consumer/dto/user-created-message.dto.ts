import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserCreatedMessageDataDto {
  @Expose()
  @IsNotEmpty()
  id: string

  @Expose()
  email: string

  @Expose({ name: 'account_lv' })
  accountLv: number

  @Expose({ name: 'created_at' })
  @IsNotEmpty()
  createdAt: number
}

export class UserCreatedMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserCreatedMessageDataDto)
  data: UserCreatedMessageDataDto
}
