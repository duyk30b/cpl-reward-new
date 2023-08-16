import { AuthValidationError } from '@lib/util'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'

export class AuthLoginDto {
  @ApiProperty()
  @IsOptional()
  @Expose()
  recaptcha: string

  // @ApiProperty()
  @Expose()
  @IsOptional()
  phone: string

  @Expose({ name: 'phone_country' })
  // @ApiProperty({ name: 'phone_country' })
  @IsOptional()
  phoneCountry: string

  @ApiProperty()
  @IsOptional()
  @Expose()
  @TransformTrim()
  email: string

  @ApiProperty({ example: 'Aa123456@!' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose()
  password: string

  @ApiProperty({ name: 'email_otp' })
  @IsOptional()
  @Expose({ name: 'email_otp' })
  @TransformTrim()
  emailOtp: string

  @ApiProperty({ name: 'authenticator_otp' })
  @IsOptional()
  @Expose({ name: 'authenticator_otp' })
  @TransformTrim()
  authenticatorOtp: string
}
