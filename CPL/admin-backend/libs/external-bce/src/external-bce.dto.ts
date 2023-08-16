import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class CurrencyResponse {
  @ApiProperty()
  @Type(() => Boolean)
  @Expose()
  result: boolean

  @ApiProperty()
  @Expose()
  @IsOptional()
  response?: any
}
