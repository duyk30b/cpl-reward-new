import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class NewsDTO {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @Expose({ name: 'per_page' })
  perPage: number

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

export class ApiCreateNewsDTO {
  @ApiProperty({ required: false, name: 'text_en' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  textEn: string

  @ApiProperty({ required: false, name: 'text_jp' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  textJp: string

  @ApiProperty({ required: false, name: 'link_text' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  linkText: string
}

export class ApiUpdateNewsDTO {
  @Expose()
  id: number

  @ApiProperty({ required: false, name: 'text_en' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  textEn: string

  @ApiProperty({ required: false, name: 'text_jp' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  textJp: string

  @ApiProperty({ required: false, name: 'link_text' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  linkText: string
}

export class ListNewsDTO {
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

  @ApiProperty({ name: 'lang', required: false })
  @Expose({ name: 'lang' })
  lang: string
}

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class DeleteNewsDTO {
  @ApiProperty()
  @Expose()
  id: number
}
