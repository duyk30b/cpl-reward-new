import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsString } from 'class-validator'

export abstract class GrpcBaseResponse<T> {
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @ApiProperty({ name: 'name' })
  name: string

  abstract data: T
}
