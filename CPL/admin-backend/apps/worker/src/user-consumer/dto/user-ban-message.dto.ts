import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserBanMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  auto?: boolean
}

export class UserBanMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserBanMessageDataDto)
  data: UserBanMessageDataDto
}
