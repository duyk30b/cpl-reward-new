import { AuthValidationError, EmailValidate } from '@lib/util'
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'
import { UserPasswordValidate } from '@lib/util'

export class AddEmailAuthenticationDto {
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

  @ApiProperty({ example: 'Aa123456@!' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MinLength(8, { message: `${AuthValidationError.MIN_LENGTH}` })
  @MaxLength(50, { message: `${AuthValidationError.MAX_LENGTH}` })
  @UserPasswordValidate()
  @Expose()
  password: string

  @ApiProperty()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose()
  @TransformTrim()
  otp: string

  @Expose({ name: 'authenticator_otp' })
  @ApiProperty({ name: 'authenticator_otp' })
  @IsOptional()
  @TransformTrim()
  authenticatorOtp: string
}
