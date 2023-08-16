import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class UserKycAdminDecisionFilterDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string
}
