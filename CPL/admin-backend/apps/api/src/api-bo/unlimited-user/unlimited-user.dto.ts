import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class UnlimitedUserDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'limit', required: false, example: 20 })
  @Expose({ name: 'limit' })
  limit: number

  @ApiProperty({ name: 'is_banned', required: false })
  @Expose({ name: 'is_banned' })
  isBanned: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ name: 'account_lv', required: false })
  @Expose({ name: 'account_lv' })
  accountLv: number

  @ApiProperty({ name: 'level_status', required: false })
  @Expose({ name: 'level_status' })
  levelStatus: string

  @ApiProperty({ name: 'risk_rating', required: false })
  @Expose({ name: 'risk_rating' })
  riskRating: number

  @ApiProperty({ name: 'registered_channel', required: false })
  @Expose({ name: 'registered_channel' })
  registeredChannel: string

  @ApiProperty({ name: 'kyc_status', required: false })
  @Expose({ name: 'kyc_status' })
  kycStatus: number

  @ApiProperty({ name: 'kyc_type', required: false })
  @Expose({ name: 'kyc_type' })
  kycType: number

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export class CreateUnlimitedUserDTO {
  @ApiProperty({ name: 'user_id' })
  @Expose()
  @IsNotEmpty()
  userId: number
}

export class UpdateUnlimitedUserDTO {
  @Expose()
  id: number

  @ApiProperty({ name: 'user_id' })
  @Expose()
  @IsNotEmpty()
  userId: number
}

export class ListUnlimitedUserDTO {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
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
  sortType: 'ASC' | 'DESC'

  @ApiProperty({ name: 'lang', required: false })
  @Expose({ name: 'lang' })
  lang: string
}

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class DeleteUnlimitedUserDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class FilterQueryDTO {
  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string
}
