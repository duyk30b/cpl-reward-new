import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { GRANT_TARGET_USER } from '@lib/mission'
import { IsIn } from 'class-validator'

export class ApiMissionFilterDto {
  @ApiProperty({ name: 'campaign_id', required: false, example: 1 })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @ApiProperty({ name: 'from_id', required: false, example: 1 })
  @Expose({ name: 'from_id' })
  fromId: number

  @ApiProperty({ required: false, example: 20 })
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
  @IsIn(['ASC', 'DESC', ''])
  sortType: 'ASC' | 'DESC'

  @ApiProperty({
    name: 'grant_target',
    required: false,
    enum: GRANT_TARGET_USER,
  })
  @IsIn(['user', 'referral_user', ''])
  @Expose({ name: 'grant_target' })
  grantTarget: string
}
