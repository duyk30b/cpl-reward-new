import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class UserBalanceDTO {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @Expose({ name: 'per_page' })
  perPage: number

  @ApiProperty({ name: 'is_banned', required: false })
  @Expose({ name: 'is_banned' })
  isBanned: number

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

export class ApiCreateUserBalanceDTO {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
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

export class ApiUpdateUserBalanceDTO {
  @Expose()
  id: number

  @ApiProperty({ required: false })
  @Expose()
  @IsNotEmpty()
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

export class ListUserBalanceDTO {
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

export class DeleteUserBalanceDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class FilterHistoryTransferDTO {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ required: false, example: 20 })
  @Expose()
  limit: number

  @ApiProperty({ required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ name: 'start_date', required: false })
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ name: 'end_date', required: false })
  @Expose({ name: 'end_date' })
  endDate: string

  @ApiProperty({ name: 'currency', required: false })
  @Expose({ name: 'currency' })
  currency: string

  @ApiProperty({ name: 'from', required: false })
  @Expose({ name: 'from' })
  from: string

  @ApiProperty({ name: 'status', required: false })
  @Expose({ name: 'status' })
  status: string

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
