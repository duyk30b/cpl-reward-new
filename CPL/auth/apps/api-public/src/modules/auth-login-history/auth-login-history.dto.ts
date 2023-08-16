import { AuthValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNumberString, IsOptional } from 'class-validator'

export class LoginHistoryFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @IsNumberString({}, { message: AuthValidationError.IS_NUMBER })
  @IsOptional()
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @IsNumberString({}, { message: AuthValidationError.IS_NUMBER })
  @IsOptional()
  @Expose({ name: 'per_page' })
  perPage: number

  @ApiProperty({ name: 'from_time', required: false })
  @IsNumberString({}, { message: AuthValidationError.IS_NUMBER })
  @IsOptional()
  @Expose({ name: 'from_time' })
  fromTime: number

  @ApiProperty({ name: 'to_time', required: false })
  @IsNumberString({}, { message: AuthValidationError.IS_NUMBER })
  @IsOptional()
  @Expose({ name: 'to_time' })
  toTime: number
}
