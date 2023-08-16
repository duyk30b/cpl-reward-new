import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class ApiCreateTagDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  names: string[]
}

export class ApiCreateOneTagDto {
  @ApiProperty()
  @Expose()
  name: string
}

export class ApiUpdateTagDto {
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  name: string
}

export class ApiSearchTagDto {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
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

export class ApiFindTagsByIdsDto {
  @ApiProperty({
    type: [Number],
  })
  @Expose()
  ids: number[]
}

export class ApiDeleteOneTagDto {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  id: number
}

export class ApiDeleteManyTagDto {
  @ApiProperty({
    type: [Number],
  })
  @Expose()
  ids: number[]
}
