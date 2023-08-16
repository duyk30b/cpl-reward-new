import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserLogoutMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'device_id' })
  @IsNotEmpty()
  deviceId: string

  @Expose()
  @IsNotEmpty()
  time: number

  @Expose({ name: 'by_login' })
  byLogin: boolean
}

export class UserLogoutMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserLogoutMessageDataDto)
  data: UserLogoutMessageDataDto
}
