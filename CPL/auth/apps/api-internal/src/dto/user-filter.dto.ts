import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'

export class UserFilterDto {
  @ApiProperty({ required: false })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false })
  @Expose({ name: 'per_page' })
  perPage: number

  @ApiProperty({ name: 'level_status', required: false })
  @Expose({ name: 'level_status' })
  levelStatus: string

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

export class CountReferralFilterDto {
  @ApiProperty({ name: 'from_lv', required: false })
  @Expose({ name: 'from_lv' })
  fromLv: number
}

export class CountUserSameIpDto {
  @ApiProperty({ name: 'from_time', required: false })
  @Expose({ name: 'from_time' })
  fromTime: number

  @ApiProperty({ name: 'to_time', required: false })
  @Expose({ name: 'to_time' })
  toTime: number
}
