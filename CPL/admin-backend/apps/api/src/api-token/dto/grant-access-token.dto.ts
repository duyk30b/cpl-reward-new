import { ApiProperty } from '@nestjs/swagger'
import { TransformTrim } from '@lib/util'
import { Expose } from 'class-transformer'

export class GrantAccessTokenDto {
  @ApiProperty({
    name: 'refresh_token',
  })
  @Expose({ name: 'refresh_token' })
  @TransformTrim()
  refreshToken: string
}
