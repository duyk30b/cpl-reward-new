import { UserStatus, UserType } from '@lib/user/enum/user.enum'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class SearchUserDto {
  @ApiPropertyOptional({ example: 1 })
  @Expose({ name: 'page' })
  @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ name: 'per_page', example: 10 })
  @Expose({ name: 'per_page' })
  @Type(() => Number)
  perPage?: number

  @ApiPropertyOptional({
    name: 'is_banned',
    example: undefined,
    enum: ['0', '1'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value == undefined) return undefined
    return value == 1
  })
  @Expose({ name: 'is_banned' })
  isBanned?: boolean

  @Expose({ name: 'search_field' })
  searchField?: string

  @Expose({ name: 'search_text' })
  searchText?: string

  @Expose({ name: 'account_lv' })
  accountLv?: number

  @Expose({ name: 'account_status' })
  accountStatus?: UserStatus

  @ApiPropertyOptional({
    name: 'account_statuses[]',
    example: [UserStatus.INACTIVE, UserStatus.PENDING_DELETE],
    type: UserStatus,
    isArray: true,
  })
  @Type(() => Number)
  @IsOptional()
  @Expose({ name: 'account_statuses' })
  accountStatuses: UserStatus[]

  @Expose({ name: 'level_status' })
  levelStatus?: string

  @Expose({ name: 'risk_rating' })
  riskRating?: number

  @Expose({ name: 'registered_channel' })
  registeredChannel?: string

  @Expose({ name: 'kyc_status' })
  kycStatus?: number

  @Expose({ name: 'kyc_type' })
  kycType?: number

  @Expose({ name: 'type' })
  type?: UserType

  @ApiPropertyOptional({
    name: 'types[]',
    example: [UserType.BOT, UserType.FUND_USER],
    type: UserType,
    isArray: true,
  })
  @Type(() => Number)
  @IsOptional()
  @Expose({ name: 'types' })
  types?: UserType[]

  @Expose({ name: 'sort' })
  sort?: string

  @Expose({ name: 'sort_type' })
  sortType?: 'ASC' | 'DESC'
}
