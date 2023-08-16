import { ApiProperty } from '@nestjs/swagger'
import { Type, Transform, Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export abstract class BasePairItemDto {
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @ApiProperty({ name: 'coin' })
  @Expose({ name: 'coin' })
  coin: string

  @Type(() => String)
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @ApiProperty({ name: 'currency' })
  @Expose({ name: 'currency' })
  currency: string
}

export abstract class GrpcBaseResponse<T> {
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @ApiProperty({ name: 'name' })
  name: string

  abstract data: T
}
