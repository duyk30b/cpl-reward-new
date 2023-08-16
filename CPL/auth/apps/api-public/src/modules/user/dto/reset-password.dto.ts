import { AuthValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'
import { UserPasswordValidate } from '@lib/util'

export class ResetPasswordDto {
  @ApiProperty()
  @IsOptional()
  @Expose()
  recaptcha: string

  @ApiProperty()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose()
  @TransformTrim()
  email: string

  @Expose({ name: 'new_password' })
  @ApiProperty({ name: 'new_password' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MinLength(8, { message: `${AuthValidationError.MIN_LENGTH}` })
  @MaxLength(50, { message: `${AuthValidationError.MAX_LENGTH}` })
  @UserPasswordValidate()
  newPassword: string

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
