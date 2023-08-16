import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNumber, IsString, ValidateNested } from 'class-validator'

export class PaginationDto {
  @ApiProperty({ name: 'page', type: Number, example: 1 })
  @Expose()
  @IsNumber()
  page: number

  @ApiProperty({ name: 'per_page', type: Number, example: 25 })
  @Expose({ name: 'per_page' })
  @IsNumber()
  perPage: number

  @ApiProperty({ name: 'total_rows', type: Number, example: 30 })
  @Expose({ name: 'total_rows' })
  @IsNumber()
  totalRows: number

  @ApiProperty({ name: 'total_pages', type: Number, example: 30 })
  @Expose({ name: 'total_pages' })
  @IsNumber()
  totalPages: number
}

export class Error {
  @ApiProperty({ name: 'status_code', type: Number, example: 2 })
  @Expose({ name: 'status_code' })
  @IsNumber()
  statusCode: number

  @Expose()
  @ApiPropertyOptional({ type: String })
  @IsString()
  code: string

  @Expose()
  @ApiPropertyOptional({ type: String })
  @IsString()
  detail: string
}

export abstract class FuturePaginationDto<T> {
  abstract positions: T

  @ApiProperty({ name: 'pagination', type: PaginationDto })
  @Expose()
  @Type(() => PaginationDto)
  @ValidateNested()
  pagination: PaginationDto

  @ApiProperty({ name: 'pagination', type: Error })
  @Type(() => Error)
  @ValidateNested()
  error: Error
}
