import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ApiCreateRoleDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Expose()
  description: string

  @ApiProperty()
  @Expose()
  permissions: number[]
}

export class ApiUpdateRoleDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Expose()
  description: string

  @ApiProperty()
  @Expose()
  permissions: number[]

  @ApiProperty()
  @Expose()
  screens: number[]
}

export class ApiSearchRoleDto {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page' })
  @Expose()
  limit: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}
