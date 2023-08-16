import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsNumber, IsOptional, ValidateNested } from 'class-validator'

export enum SORT_TYPE {
  DESC = -1,
  ASC = 1,
}

export class BasePaginationQueryDto {
  @ApiPropertyOptional({
    name: 'sort_type',
    enum: Object.values(SORT_TYPE).filter((value) => typeof value === 'number'),
    default: SORT_TYPE.DESC,
  })
  @Expose({ name: 'sort_type' })
  @IsOptional()
  sortType?: SORT_TYPE

  @ApiPropertyOptional({ name: 'per_page', type: Number, default: 25 })
  @Expose({ name: 'per_page' })
  @IsOptional()
  @Transform((params) => {
    if (params?.value < 1) return 25
    if (params?.value > 1000) return 1000
    return params?.value
  })
  perPage?: number = 25

  @ApiPropertyOptional({ name: 'page', type: Number, default: 1 })
  @Expose({ name: 'page' })
  @IsOptional()
  page?: number = 1
}

export class PaginationDto {
  @ApiProperty({ name: 'page', type: Number, example: 1 })
  @Expose()
  @IsNumber()
  page: number

  @ApiProperty({ name: 'size', type: Number, example: 25 })
  @Expose()
  @IsNumber()
  size: number

  @ApiProperty({ name: 'total', type: Number, example: 30 })
  @Expose()
  @IsNumber()
  total: number
}

export abstract class BasePaginationDto<T> {
  abstract data: T

  @ApiProperty({ name: 'pagination', type: PaginationDto })
  @Expose()
  @Type(() => PaginationDto)
  @ValidateNested()
  pagination: PaginationDto
}
