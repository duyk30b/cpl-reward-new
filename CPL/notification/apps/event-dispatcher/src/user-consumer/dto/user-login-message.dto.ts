import { KafkaMessageDto } from '@libs/kafka'
import { DeviceDto } from '@libs/common'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserLoginMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  @ValidateNested()
  @Type(() => DeviceDto)
  device: DeviceDto

  @Expose()
  ip: string

  @Expose()
  lang: string

  @Expose({ name: 'is_register' })
  isRegister: boolean

  @Expose()
  time: number
}

export class UserLoginMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserLoginMessageDataDto)
  data: UserLoginMessageDataDto
}
