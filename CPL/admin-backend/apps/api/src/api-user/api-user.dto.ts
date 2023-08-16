import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import * as moment from 'moment'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ValidationError } from '@lib/util'
import { EmailValidate } from '@lib/util/decorators/validation.decorator'

export class UserFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @Expose({ name: 'per_page' })
  perPage: number

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

  @ApiProperty({ name: 'account_status', required: false })
  @Expose({ name: 'account_status' })
  accountStatus: number

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

  @ApiProperty({ name: 'type', required: false })
  @Expose({ name: 'type' })
  type: number
}

export class UserFilterMarketingDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @Expose({ name: 'per_page' })
  perPage: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ name: 'account_lv', required: false })
  @Expose({ name: 'account_lv' })
  accountLv: number

  @ApiProperty({ name: 'risk_rating', required: false })
  @Expose({ name: 'risk_rating' })
  riskRating: number

  @ApiProperty({ name: 'registered_channel', required: false })
  @Expose({ name: 'registered_channel' })
  registeredChannel: string

  @ApiProperty({ name: 'tag_ids', type: [Number], required: false })
  @Expose({ name: 'tag_ids' })
  tagIds: string[]

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'

  @Expose({ name: 'register_date' })
  registerDate: string[]

  @Expose({ name: 'start_register_date' })
  get startRegisterDate() {
    return this.registerDate?.length == 2 && moment(this.registerDate[0]).unix()
      ? moment(this.registerDate[0]).unix() * 1000
      : null
  }

  @Expose({ name: 'end_register_date' })
  get endRegisterDate() {
    return this.registerDate?.length == 2 && moment(this.registerDate[1]).unix()
      ? moment(this.registerDate[1]).add(1, 'd').unix() * 1000 - 1
      : null
  }
}

export class UserExportTypeDto {
  @ApiProperty({ required: true, example: 'user-basic-info' })
  @Expose()
  type: string
}

export class UserBanHistoryFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @Expose({ name: 'per_page' })
  perPage: number

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
}

export class UserSearchDto {
  @ApiProperty({ name: 'page', type: Number })
  @IsString()
  @IsOptional()
  @Expose({ name: 'page' })
  page?: number

  @ApiProperty({ name: 'limit', type: Number })
  @IsString()
  @IsOptional()
  @Expose({ name: 'limit' })
  limit?: number

  @ApiProperty({ name: 'ids', type: Array })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => String)
  @Expose({ name: 'ids' })
  ids?: string[]

  @ApiProperty({ name: 'type', type: Number })
  @IsString()
  @IsOptional()
  @Expose({ name: 'type' })
  type?: number

  @ApiProperty({ name: 'statuses', type: Array })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Number)
  @Expose({ name: 'statuses' })
  statuses?: number[]

  @ApiProperty({ name: 'kyc_verify_statuses', type: Array })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Number)
  @Expose({ name: 'kyc_verify_statuses' })
  kycVerifyStatuses?: number[]

  @ApiProperty({ name: 'authenticator_verify_statuses', type: Array })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Number)
  @Expose({ name: 'authenticator_verify_statuses' })
  authenticatorVerifyStatuses?: number[]

  @ApiProperty({ name: 'user_info_statuses', type: Array })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Number)
  @Expose({ name: 'user_info_statuses' })
  userInfoStatuses?: number[]

  @ApiProperty({ name: 'account_lv_from', type: Number })
  @IsString()
  @IsOptional()
  @Expose({ name: 'account_lv_from' })
  accountLvFrom?: number

  @ApiProperty({ name: 'account_lv_to', type: Number })
  @IsString()
  @IsOptional()
  @Expose({ name: 'account_lv_to' })
  accountLvTo?: number

  @ApiProperty({ name: 'created_at_from', type: String })
  @IsString()
  @IsOptional()
  @Expose({ name: 'created_at_from' })
  createdAtFrom?: string

  @ApiProperty({ name: 'created_at_to', type: String })
  @IsString()
  @IsOptional()
  @Expose({ name: 'created_at_to' })
  createdAtTo?: string

  @ApiProperty({ name: 'last_login_from', type: String })
  @IsString()
  @IsOptional()
  @Expose({ name: 'last_login_from' })
  lastLoginFrom?: string

  @ApiProperty({ name: 'last_login_to', type: String })
  @IsString()
  @IsOptional()
  @Expose({ name: 'last_login_to' })
  lastLoginTo?: string

  @ApiProperty({ name: 'email', type: String })
  @IsString()
  @IsOptional()
  @Expose({ name: 'email' })
  email?: string
  sort?: string
  sortType?: string
}

export class ChangeEmailDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @EmailValidate()
  @Expose({ name: 'new_email' })
  newEmail: string
}

export class UserBlacklistHistoryFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

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
  sortType: 'ASC' | 'DESC'

  @ApiProperty({ name: 'user_id', required: false })
  @Expose({ name: 'user_id' })
  userId: string
}
