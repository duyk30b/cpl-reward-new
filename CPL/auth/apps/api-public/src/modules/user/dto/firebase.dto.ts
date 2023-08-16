import { AuthValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Expose } from 'class-transformer'
import { TransformTrim } from '@lib/util'

export class FirebaseDto {
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
  id_token: string

  @ApiProperty()
  @IsOptional()
  @Expose()
  @TransformTrim()
  referrer: string
}
