import { AuthValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'

export class VerifyEmailDto {
  @ApiProperty()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose()
  @TransformTrim()
  otp: string
}
