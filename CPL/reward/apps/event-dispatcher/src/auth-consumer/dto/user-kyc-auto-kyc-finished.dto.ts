import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsBoolean, IsDefined, ValidateNested } from 'class-validator'

export class UserKycAutoKycFinishedData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose()
  @IsBoolean()
  pass: boolean
}

export class UserKycAutoKycFinishedDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserKycAutoKycFinishedData)
  data: UserKycAutoKycFinishedData
}
