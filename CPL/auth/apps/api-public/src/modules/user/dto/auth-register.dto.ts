import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { AuthValidationError, EmailValidate } from '@lib/util'
import { TransformTrim } from '@lib/util'
import { Expose } from 'class-transformer'
import { UserPasswordValidate } from '@lib/util'

export class AuthRegisterDto {
  @ApiProperty()
  @IsOptional()
  @Expose()
  recaptcha: string

  @ApiProperty()
  @EmailValidate()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(255, {
    message: AuthValidationError.MAX_LENGTH,
  })
  @TransformTrim()
  @Expose()
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

  @ApiProperty({
    example: '674568',
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose()
  @TransformTrim()
  otp: string

  @ApiProperty()
  @IsOptional()
  @Expose()
  @TransformTrim()
  referrer: string

  @ApiProperty({
    name: 'referrer_channel',
    required: false,
  })
  @IsOptional()
  @Expose({ name: 'referrer_channel' })
  @TransformTrim()
  referrerChannel: string
}
