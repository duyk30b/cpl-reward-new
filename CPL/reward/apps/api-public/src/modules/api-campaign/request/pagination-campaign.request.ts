import { SearchFieldCampaign, SortFieldCampaign } from '@libs/typeorm/campaign'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsIn, IsNumber } from 'class-validator'

export class PaginationCampaignRequest {
  @ApiPropertyOptional({ example: 1 })
  @Expose()
  @Transform(({ value }) => parseInt(value) || 1)
  @IsNumber()
  page: number

  @ApiPropertyOptional({ example: 20 })
  @Expose()
  @Transform(({ value }) => (parseInt(value) > 100 ? 100 : parseInt(value) || 20))
  @IsNumber()
  limit: number

  @ApiPropertyOptional({ name: 'search_field', enum: Object.keys(SearchFieldCampaign) })
  @Expose({ name: 'search_field' })
  @IsIn(Object.keys(SearchFieldCampaign))
  searchField: keyof typeof SearchFieldCampaign

  @ApiPropertyOptional({ name: 'search_text' })
  @Expose({ name: 'search_text' })
  @Transform(({ value }) => value?.replace(/%/g, '\\%').replace(/_/g, '\\_') || '')
  searchText: string

  @ApiPropertyOptional({ name: 'sort', enum: Object.keys(SortFieldCampaign) })
  @Expose({ name: 'sort' })
  @IsIn(Object.keys(SortFieldCampaign))
  sortField: keyof typeof SortFieldCampaign

  @ApiPropertyOptional({ name: 'sort_type', enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => value || 'ASC')
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC'
}
