import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class UserKycHistoryFilterDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string
}
