import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ChangeEmailDto {
  @ApiProperty({ name: 'new_email' })
  @Expose({ name: 'new_email' })
  newEmail: string
}
