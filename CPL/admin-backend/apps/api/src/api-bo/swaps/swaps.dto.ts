import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ListSwapsRequestDTO {
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

  @ApiProperty({ name: 'start_date', required: false })
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ name: 'end_date', required: false })
  @Expose({ name: 'end_date' })
  endDate: string

  @ApiProperty({ name: 'currency', required: false })
  @Expose({ name: 'currency' })
  currency: string

  @ApiProperty({ name: 'status', required: false })
  @Expose({ name: 'status' })
  status: string
}
