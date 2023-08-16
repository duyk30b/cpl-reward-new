import { EValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class BalanceAccountForUserRequest {
  @ApiProperty({
    example: '1234',
  })
  @Expose()
  @IsNumber({}, { message: EValidationError.IS_NUMBER })
  @Type(() => Number)
  user_id: string
}
