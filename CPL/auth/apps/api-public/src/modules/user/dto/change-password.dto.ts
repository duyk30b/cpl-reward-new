import { AuthValidationError } from '@lib/util'
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'
import { UserPasswordValidate } from '@lib/util'

export class ChangePasswordDto {
  @Expose({ name: 'old_password' })
  @ApiProperty({ name: 'old_password' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  oldPassword: string

  @Expose({ name: 'new_password' })
  @ApiProperty({ name: 'new_password' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MinLength(8, { message: `${AuthValidationError.MIN_LENGTH}` })
  @MaxLength(50, { message: `${AuthValidationError.MAX_LENGTH}` })
  @UserPasswordValidate()
  newPassword: string

  @Expose({ name: 'authenticator_otp' })
  @ApiProperty({ name: 'authenticator_otp' })
  @IsOptional()
  @TransformTrim()
  authenticatorOtp: string
}
