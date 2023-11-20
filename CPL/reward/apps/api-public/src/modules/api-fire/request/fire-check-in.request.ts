import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class FireCheckInQuery {
  @ApiProperty({ name: 'user_id_start', example: 58000 })
  @Expose({ name: 'user_id_start' })
  @Type(() => Number)
  @IsNumber()
  userIdStart: number

  @ApiProperty({ name: 'user_id_end', example: 58010 })
  @Expose({ name: 'user_id_end' })
  @Type(() => Number)
  @IsNumber()
  userIdEnd: number

  @ApiProperty({ name: 'gap', example: 100 })
  @Expose({ name: 'gap' })
  @Type(() => Number)
  @IsNumber()
  gap: number

  @ApiProperty({ name: 'duplicate', example: 5 })
  @Expose({ name: 'duplicate' })
  @Type(() => Number)
  @IsNumber()
  duplicate: number
}
