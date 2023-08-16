import { ApiProperty } from '@nestjs/swagger'
import { AuthValidationError } from '@lib/util'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class GenerateAuthenticatorInfoDto {
  @ApiProperty()
  @IsNotEmpty({ message: AuthValidationError.REQUIRED })
  @Expose()
  password: string
}
