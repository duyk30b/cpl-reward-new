import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class AdminFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @Expose({ name: 'per_page' })
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

export class SetPermissionsDto {
  @ApiProperty()
  @Expose()
  roles: string[]

  @ApiProperty({ name: 'direct_permissions' })
  @Expose({ name: 'direct_permissions' })
  directPermissions: number[]

  @ApiProperty({ name: 'direct_screens' })
  @Expose({ name: 'direct_screens' })
  directScreens: number[]
}

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string
}
