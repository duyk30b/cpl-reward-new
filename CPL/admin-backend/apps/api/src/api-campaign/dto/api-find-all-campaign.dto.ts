import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ApiFindAllCampaignDto {
  @ApiProperty({ name: 'page', example: 1 })
  @Expose({ name: 'page' })
  page: number

  @ApiProperty({ name: 'limit', example: 10 })
  @Expose({ name: 'limit' })
  limit: number

  @ApiPropertyOptional({ name: 'search_field', example: 'title' })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiPropertyOptional({ name: 'search_text', example: 'an' })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiPropertyOptional({ name: 'sort', example: 'id' })
  @Expose({ name: 'sort' })
  sort: string

  @ApiPropertyOptional({ name: 'sort_type', enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}
