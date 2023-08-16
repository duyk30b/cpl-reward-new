import { ApiProperty } from '@nestjs/swagger'
import { TransformTrim } from '@lib/util'
import { AuthValidationError } from '@lib/util'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class VerifyAuthenticatorDto {
  @ApiProperty()
  @IsNotEmpty({ message: AuthValidationError.REQUIRED })
  @Expose()
  @TransformTrim()
  otp: string
}
