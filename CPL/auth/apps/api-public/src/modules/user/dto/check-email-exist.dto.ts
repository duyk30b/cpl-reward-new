import { AuthValidationError } from '@lib/util'
import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TransformTrim } from '@lib/util'
import { Expose } from 'class-transformer'

export class CheckEmailExistDto {
  @ApiProperty()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @TransformTrim()
  @Expose()
  email: string
}
