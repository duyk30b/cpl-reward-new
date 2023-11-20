import { SearchFieldCampaign, SortFieldCampaign } from '@libs/typeorm/campaign'
import { SortFieldRewardHistory } from '@libs/typeorm/reward-history'
import { Expose, Transform } from 'class-transformer'
import { IsIn } from 'class-validator'

export class PaginationCampaignRequest {
  @Expose({ name: 'page' })
  @Transform(({ value }) => value || 1)
  page: number

  @Expose()
  @Transform(({ value }) => (value > 100 ? 100 : value || 20))
  limit: number

  @Expose({ name: 'search_field' })
  @IsIn([...Object.keys(SearchFieldCampaign), ''])
  searchField: keyof typeof SearchFieldCampaign

  @Expose({ name: 'search_text' })
  @Transform(({ value }) => value?.replace(/%/g, '\\%').replace(/_/g, '\\_') || '')
  searchText: string

  @Expose({ name: 'sort' })
  @IsIn([...Object.keys(SortFieldCampaign), ''])
  sortField: keyof typeof SortFieldCampaign

  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => value || 'ASC')
  @IsIn(['ASC', 'DESC'])
  sortType?: 'ASC' | 'DESC'
}

export class PaginationRewardHistoryRequest {
  @Expose()
  @Transform(({ value }) => value || 1)
  page: number

  @Expose()
  @Transform(({ value }) => (value > 100 ? 100 : value || 20))
  limit: number

  @Expose({ name: 'sort' })
  @IsIn([...Object.keys(SortFieldRewardHistory), ''])
  sortField?: keyof typeof SortFieldRewardHistory

  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => value || 'ASC')
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC'
}

export class CountMissingRewardHistoryRequest {
  @Expose()
  status: number

  @Expose({ name: 'from_time' })
  fromTime?: number

  @Expose({ name: 'to_time' })
  toTime?: number
}
