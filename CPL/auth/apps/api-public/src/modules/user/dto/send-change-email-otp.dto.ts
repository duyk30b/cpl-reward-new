import { AuthValidationError, EmailValidate } from '@lib/util'
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'

export class SendChangeEmailOtpDto {
  @ApiProperty()
  @IsOptional()
  @Expose()
  recaptcha: string

  @Expose({ name: 'new_email' })
  @ApiProperty({ name: 'new_email' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @EmailValidate()
  @MaxLength(255, {
    message: AuthValidationError.MAX_LENGTH,
  })
  @TransformTrim()
  newEmail: string
}
