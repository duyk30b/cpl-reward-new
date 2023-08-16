import { IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'

export class DeleteAccountDto {
  @ApiProperty({ example: 'Aa123456@!' })
  @IsOptional()
  @Expose()
  password: string

  @Expose({ name: 'authenticator_otp' })
  @ApiProperty({ name: 'authenticator_otp' })
  @IsOptional()
  @TransformTrim()
  authenticatorOtp: string
}
