import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class FilterAdminActionLogDto {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  limit: number

  @ApiProperty({ name: 'admin_id', required: false })
  @Expose({ name: 'admin_id' })
  adminId: string

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
