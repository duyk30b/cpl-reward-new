import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNumber, IsOptional, ValidateNested } from 'class-validator'

export class LinkPaginationResponse {
  @ApiProperty()
  next: string

  @ApiProperty()
  prev: string
}

export class PaginationData {
  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  @IsOptional()
  page?: number

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  @IsOptional()
  size?: number

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  @IsOptional()
  total?: number
}

export class BasePaginationResponse<T> {
  @Expose()
  @ApiProperty()
  data: T

  @Expose()
  @ApiProperty({ type: LinkPaginationResponse })
  @Type(() => LinkPaginationResponse)
  @ValidateNested()
  links: LinkPaginationResponse

  @Expose()
  @ApiProperty({ type: PaginationData })
  @Type(() => PaginationData)
  @ValidateNested()
  pagination: PaginationData
}
