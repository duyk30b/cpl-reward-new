import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, ValidateNested } from 'class-validator'

export class UserAuthenticatorStatusUpdatedData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose({ name: 'new_level' })
  @IsNumber()
  status: number
}

export class UserAuthenticatorStatusUpdatedDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserAuthenticatorStatusUpdatedData)
  data: UserAuthenticatorStatusUpdatedData
}
