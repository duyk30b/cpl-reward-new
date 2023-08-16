import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'
import { EValidationError, TransformTrim } from '@lib/util'
import { ValidationError } from '@lib/util/formater/error'

export class ApiAuthLoginDto {
  @ApiProperty()
  @IsNotEmpty({
    message: EValidationError.REQUIRED,
  })
  @Expose()
  email: string

  @ApiProperty()
  @IsNotEmpty({
    message: EValidationError.REQUIRED,
  })
  @Expose()
  password: string

  @ApiProperty()
  @IsNotEmpty({ message: EValidationError.REQUIRED })
  @Expose()
  @TransformTrim()
  otp: string

  @ApiProperty({
    required: false,
  })
  @Expose()
  @TransformTrim()
  lang: string
}

export class ApiAuthLoginVerifyDto {
  @ApiProperty()
  @IsNotEmpty({
    message: EValidationError.REQUIRED,
  })
  @Expose()
  email: string

  @ApiProperty()
  @IsNotEmpty({
    message: EValidationError.REQUIRED,
  })
  @Expose()
  token: string

  @ApiProperty()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @Expose()
  @TransformTrim()
  otp: string
}

export class GenerateAuthenticatorInfoDto {
  @ApiProperty()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @Expose()
  @TransformTrim()
  password: string
}

export class ApiAdminChangePasswordDto {
  @ApiProperty({
    name: 'old_password',
  })
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @Expose({
    name: 'old_password',
  })
  oldPassword: string

  @ApiProperty({ name: 'new_password' })
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @Expose({ name: 'new_password' })
  newPassword: string
}

export class GenerateAuthenticatorInfoResponseDto {
  @Expose()
  @TransformTrim()
  secret: string
}

export class AdminResponseDto {
  @Expose()
  id: string

  @Expose()
  email: string

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  updatedAt: number
}
