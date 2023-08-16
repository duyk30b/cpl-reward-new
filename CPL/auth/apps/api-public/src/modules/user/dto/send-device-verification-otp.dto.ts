import { AuthValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'

export class SendDeviceVerificationOtpDto {
  @ApiProperty()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose()
  @TransformTrim()
  email: string

  @ApiProperty()
  @IsOptional()
  @Expose()
  recaptcha: string
}
