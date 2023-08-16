import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length, Matches } from 'class-validator'

export class ApiCreateChannelDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Matches('^([a-zA-Z0-9_]*)$')
  @Length(0, 255)
  name: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  link: string

  @ApiProperty({ name: 'tag_ids' })
  @Expose({ name: 'tag_ids' })
  tagIds: string
}

export class ApiUpdateChannelDto {
  @Expose()
  id: number

  @ApiProperty({ required: false })
  @Expose()
  @IsNotEmpty()
  @Matches('^([a-zA-Z0-9_]*)$')
  @Length(0, 255)
  name: string

  @ApiProperty({ required: false })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  link: string

  @ApiProperty({ name: 'tag_ids' })
  @Expose({ name: 'tag_ids' })
  tagIds?: string
}

export class ListChannelDto {
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

export class FindOneByLinkDto {
  @ApiProperty()
  @Expose()
  link: string
}

export class FindOneByIdDto {
  @ApiProperty()
  @Expose()
  id: number
}

export class DeleteChannelDto {
  @ApiProperty()
  @Expose()
  id: number
}
