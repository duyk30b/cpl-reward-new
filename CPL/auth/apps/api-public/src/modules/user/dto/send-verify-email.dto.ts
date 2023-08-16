import { AuthValidationError, EmailValidate } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'

export class SendVerifyEmailDto {
  @ApiProperty()
  @IsOptional()
  @Expose()
  recaptcha: string

  @ApiProperty()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @EmailValidate()
  @MaxLength(255, {
    message: AuthValidationError.MAX_LENGTH,
  })
  @Expose()
  @TransformTrim()
  email: string
}
