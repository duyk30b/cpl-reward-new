import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'

export class AdminLoginHistoryFilterDto {
  @ApiProperty({ name: 'user_id', required: false })
  @Expose({ name: 'user_id' })
  userId: string

  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @Expose({ name: 'per_page' })
  perPage: number

  @ApiProperty({ name: 'from_time', required: false })
  @Expose({ name: 'from_time' })
  fromTime: number

  @ApiProperty({ name: 'to_time', required: false })
  @Expose({ name: 'to_time' })
  toTime: number

  @ApiProperty({
    name: 'selected_search',
    required: false,
    enum: ['email'],
  })
  @Expose({ name: 'selected_search' })
  selectedSearch: string

  @ApiProperty({ name: 'search_key', required: false })
  @Expose({ name: 'search_key' })
  searchKey: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false })
  @Expose({ name: 'sort_type' })
  @Transform((params) => {
    return params.value ? params.value.toUpperCase() : params.value
  })
  sortType: 'ASC' | 'DESC'
}
