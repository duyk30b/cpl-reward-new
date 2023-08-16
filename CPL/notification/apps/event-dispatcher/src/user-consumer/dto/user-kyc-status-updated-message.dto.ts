import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserKycStatusUpdatedMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  @IsNotEmpty()
  status: number

  @Expose({ name: 'old_status' })
  @IsNotEmpty()
  oldStatus: number
}

export class UserKycStatusUpdatedMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserKycStatusUpdatedMessageDataDto)
  data: UserKycStatusUpdatedMessageDataDto
}
