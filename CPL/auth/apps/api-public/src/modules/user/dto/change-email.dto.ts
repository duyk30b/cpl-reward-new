import { AuthValidationError, EmailValidate } from '@lib/util'
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'

export class ChangeEmailDto {
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

  @ApiProperty({ example: 'Aa123456@!' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose()
  password: string

  // @Expose({ name: 'current_email_otp' })
  // @ApiProperty({ name: 'current_email_otp' })
  // @IsOptional()
  // @TransformTrim()
  // currentEmailOtp: string

  @Expose({ name: 'authenticator_otp' })
  @ApiProperty({ name: 'authenticator_otp' })
  @IsOptional()
  @TransformTrim()
  authenticatorOtp: string

  @Expose({ name: 'new_email_otp' })
  @ApiProperty({ name: 'new_email_otp' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @TransformTrim()
  newEmailOtp: string
}
