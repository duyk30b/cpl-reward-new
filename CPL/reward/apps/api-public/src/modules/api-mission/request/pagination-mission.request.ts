import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'

export class PaginationMissionRequest {
  @ApiPropertyOptional({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  @Type(() => Number)
  campaignId: number

  @ApiPropertyOptional({ name: 'from_id', example: 1 })
  @Expose({ name: 'from_id' })
  @Transform(({ value }) => (parseInt(value) > 1 ? parseInt(value) : 1))
  @Type(() => Number)
  page: number

  @ApiPropertyOptional({ example: 20 })
  @Expose({ name: 'limit' })
  @Transform(({ value }) => (parseInt(value) > 100 ? 100 : parseInt(value) || 20))
  limit: number
}
