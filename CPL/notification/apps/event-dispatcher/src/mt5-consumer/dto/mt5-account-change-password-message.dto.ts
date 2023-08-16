import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class Mt5AccountChangePasswordMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  @IsNotEmpty()
  login: string

  @Expose()
  @IsNotEmpty()
  otp: string
}

export class Mt5AccountChangePasswordMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => Mt5AccountChangePasswordMessageDataDto)
  data: Mt5AccountChangePasswordMessageDataDto
}
