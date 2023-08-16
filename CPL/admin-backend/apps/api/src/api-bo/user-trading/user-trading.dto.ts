import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class UserTradingDTO {
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

export class ApiCreateUserTradingDTO {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  name: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  link: string

  @ApiProperty({ name: 'tag_ids' })
  @Expose({ name: 'tag_ids' })
  tagIds: string
}

export class ApiUpdateUserTradingDTO {
  @Expose()
  id: number

  @ApiProperty({ required: false })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  name: string

  @ApiProperty({ required: false })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  link: string

  @ApiProperty({ name: 'tag_ids' })
  @Expose({ name: 'tag_ids' })
  tagIds?: string
}

export class ListUserTradingDTO {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  limit: number

  @Optional()
  @Expose()
  skip: number

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

  @Optional()
  @Expose({ name: 'win_lose' })
  winLose: string

  @Optional()
  @Expose()
  status: string

  @Optional()
  @Expose()
  mode: string

  @Optional()
  @Expose()
  period: string

  @Optional()
  @Expose()
  pair: string

  @ApiProperty({ name: 'start_date', required: false })
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ name: 'end_date', required: false })
  @Expose({ name: 'end_date' })
  endDate: string

  @Optional()
  @Expose()
  lang: string
}

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class DeleteUserTradingDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class RequestStatisticSummaryDto {
  @ApiProperty({ name: 'start_date', required: true })
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ name: 'end_date', required: true })
  @Expose({ name: 'end_date' })
  endDate: string

  @ApiProperty({ name: 'lang', required: false })
  @Expose({ name: 'lang' })
  lang: string
}

export class RequestStatisticDetailDto {
  @ApiProperty({ name: 'start_date', required: true })
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ name: 'end_date', required: true })
  @Expose({ name: 'end_date' })
  endDate: string

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

export class RequestStatisticUserDto {
  @ApiProperty({ name: 'start_date', required: true })
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ name: 'end_date', required: true })
  @Expose({ name: 'end_date' })
  endDate: string

  @ApiProperty({ name: 'user_id', required: true })
  @Expose({ name: 'user_id' })
  userId: number

  @ApiProperty({ name: 'lang', required: false })
  @Expose({ name: 'lang' })
  lang: string
}

export class StatisticSummaryDto {
  @ApiProperty()
  @Expose({ name: 'number_of_users' })
  numberOfUsers: string

  @ApiProperty()
  @Expose({ name: 'active_users' })
  activeUsers: string

  @ApiProperty()
  @Expose({ name: 'winning_users' })
  winningUsers: string

  @ApiProperty()
  @Expose({ name: 'losing_users' })
  losingUsers: string

  @ApiProperty()
  @Expose({ name: 'operating_profit' })
  operatingProfit: string

  @ApiProperty()
  @Expose({ name: 'number_of_withdraw_als' })
  numberOfWithdrawAls: string

  @ApiProperty()
  @Expose({ name: 'number_of_withdrawals' })
  numberOfWithdrawals: string

  @ApiProperty()
  @Expose({ name: 'cumulative_amount' })
  cumulativeAmount: string

  @ApiProperty()
  @Expose({ name: 'average_withdrawal_amount' })
  averageWithdrawalAmount: string

  @ApiProperty()
  @Expose({ name: 'withdrawal_ratio' })
  withdrawalRatio: string

  @ApiProperty()
  @Expose({ name: 'cumulative_deposit_amount' })
  cumulativeDepositAmount: string

  @ApiProperty()
  @Expose({ name: 'total_user_balance' })
  totalUserBalance: string

  @ApiProperty()
  @Expose({ name: 'order_times' })
  orderTimes: string

  @ApiProperty()
  @Expose({ name: 'user_wins' })
  userWins: string

  @ApiProperty()
  @Expose({ name: 'user_loses' })
  userLoses: string

  @ApiProperty()
  @Expose({ name: 'user_win_rate' })
  userWinRate: string;

  @ApiProperty()
  @Expose({ name: 'in' })
  in: string

  @ApiProperty()
  @Expose({ name: 'out' })
  out: string

  @ApiProperty()
  @Expose({ name: 'payout_rate' })
  payoutRate: string

  @ApiProperty()
  @Expose({ name: 'bcast_rank_1' })
  bcastRank1: string

  @ApiProperty()
  @Expose({ name: 'bcast_rank_2' })
  bcastRank2: string

  @ApiProperty()
  @Expose({ name: 'bcast_rank_3' })
  bcastRank3: string

  @ApiProperty()
  @Expose({ name: 'order_limit_users' })
  orderLimitUsers: string

  @ApiProperty()
  @Expose({ name: 'number_of_depositors' })
  numberOfDepositors: string
}

export class StatisticDetailDto {
  @ApiProperty()
  @Expose({ name: 'in' })
  in: string

  @ApiProperty()
  @Expose({ name: 'mode' })
  mode: string

  @ApiProperty()
  @Expose({ name: 'operating_profit' })
  operatingProfit: string

  @ApiProperty()
  @Expose({ name: 'out' })
  out: string

  @ApiProperty()
  @Expose({ name: 'order_times' })
  orderTimes: string

  @ApiProperty()
  @Expose({ name: 'payout_rate' })
  payoutRate: string

  @ApiProperty()
  @Expose({ name: 'period' })
  period: string

  @ApiProperty()
  @Expose({ name: 'user_loses' })
  userLoses: string

  @ApiProperty()
  @Expose({ name: 'user_win_rate' })
  userWinRate: string

  @ApiProperty()
  @Expose({ name: 'user_wins' })
  userWins: string
}

export class StatisticUserDto {
  @ApiProperty()
  @Expose({ name: 'average_withdrawal_amount' })
  averageWithdrawalAmount: string

  @ApiProperty()
  @Expose({ name: 'bcast_amount' })
  bcastAmount: string

  @ApiProperty()
  @Expose({ name: 'bcast_rank' })
  bcastRank: string

  @ApiProperty()
  @Expose({ name: 'cumulative_amount' })
  cumulativeAmount: string

  @ApiProperty()
  @Expose({ name: 'cumulative_deposit_amount' })
  cumulativeDepositAmount: string

  @ApiProperty()
  @Expose({ name: 'lose_times' })
  loseTimes: string

  @ApiProperty()
  @Expose({ name: 'number_of_withdraw_als' })
  numberOfWithdrawAls: string

  @ApiProperty()
  @Expose({ name: 'operating_profit' })
  operatingProfit: string

  @ApiProperty()
  @Expose({ name: 'order_limit_user' })
  orderLimitUser: string

  @ApiProperty()
  @Expose({ name: 'order_times' })
  orderTimes: string

  @ApiProperty()
  @Expose({ name: 'payout_rate' })
  payoutRate: string

  @ApiProperty()
  @Expose({ name: 'total_balance' })
  totalBalance: string

  @ApiProperty()
  @Expose({ name: 'win_rate' })
  winRate: string

  @ApiProperty()
  @Expose({ name: 'win_times' })
  winTimes: string

  @ApiProperty()
  @Expose({ name: 'withdrawal_ratio' })
  withdrawalRatio: string
}

export class RequestSuspensionModesDto {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  limit: number

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ required: false })
  @Expose()
  mode: string

  @ApiProperty({ required: false })
  @Expose()
  period: string

  @ApiProperty({ name: 'pair', required: false })
  @Expose({ name: 'pair' })
  pair: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}
