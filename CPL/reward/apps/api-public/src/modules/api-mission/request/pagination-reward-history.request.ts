import { SortFieldRewardHistory } from '@libs/typeorm/reward-history'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsIn } from 'class-validator'

export class PaginationRewardHistoryRequest {
  @ApiPropertyOptional({ name: 'page' })
  @Expose({ name: 'page' })
  @Transform(({ value }) => (parseInt(value) > 1 ? parseInt(value) : 1))
  @Type(() => Number)
  page: number

  @ApiPropertyOptional({ name: 'limit' })
  @Expose({ name: 'limit' })
  @Transform(({ value }) => (parseInt(value) > 50 ? 50 : parseInt(value) || 20))
  limit: number

  @ApiPropertyOptional({ name: 'sort', enum: Object.keys(SortFieldRewardHistory) })
  @Expose({ name: 'sort' })
  @IsIn(Object.keys(SortFieldRewardHistory))
  sortField?: keyof typeof SortFieldRewardHistory

  @ApiPropertyOptional({ name: 'sort_type', enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  @Transform(({ value }) => value || 'ASC')
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC'
}
