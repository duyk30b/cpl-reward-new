import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ApiFindOneTradingModeDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class ApiListTradingModeDTO {
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

  @ApiProperty({ name: 'get_only', required: false, enum: ['true', 'false'] })
  @Expose({ name: 'get_only' })
  getOnly: 'true' | 'false'

  @ApiProperty({ name: 'mode', required: false })
  @Expose({ name: 'mode' })
  mode: string

  @ApiProperty({ name: 'period', required: false })
  @Expose({ name: 'period' })
  period: string

  @ApiProperty({ name: 'lang', required: false })
  @Expose({ name: 'lang' })
  lang: string

  @ApiProperty({ name: 'pair_id', required: false })
  @Expose({ name: 'pair_id' })
  pairId: string

  @ApiProperty({ name: 'status', required: false })
  @Expose({ name: 'status' })
  status: string
}

export class ApiCreateTradingModeDTO {
  @ApiProperty({ required: false, name: 'mode' })
  @Expose()
  @IsNotEmpty()
  mode: string

  @ApiProperty({ required: false, name: 'period' })
  @Expose()
  @IsNotEmpty()
  period: string

  @ApiProperty({ required: false, name: 'start_time' })
  @Expose()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ required: false, name: 'end_time' })
  @Expose()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ required: false, name: 'payout' })
  @Expose()
  @IsNotEmpty()
  payout: number

  @ApiProperty({ required: false, name: 'suggestion_1' })
  @Expose()
  @IsNotEmpty()
  suggestion1: number

  @ApiProperty({ required: false, name: 'suggestion_2' })
  @Expose()
  @IsNotEmpty()
  suggestion2: number

  @ApiProperty({ required: false, name: 'suggestion_3' })
  @Expose()
  @IsNotEmpty()
  suggestion3: number

  @ApiProperty({ required: false, name: 'scaling_active' })
  @Expose()
  @IsNotEmpty()
  scalingActive: number

  @ApiProperty({ required: false, name: 'scaling_bcast' })
  @Expose()
  @IsNotEmpty()
  scalingBcast: number

  @ApiProperty({ required: false, name: 'payout_max' })
  @Expose()
  @IsNotEmpty()
  payoutMax: number

  @ApiProperty({ required: false, name: 'rank_scaling_active' })
  @Expose()
  @IsNotEmpty()
  rankScalingActive: number

  @ApiProperty({ required: false, name: 'limit_order_min' })
  @Expose()
  @IsNotEmpty()
  limitOrderMin: number

  @ApiProperty({ required: false, name: 'limit_order_max' })
  @Expose()
  @IsNotEmpty()
  limitOrderMax: number

  @ApiProperty({ required: false, name: 'limit_order_max_amount' })
  @Expose()
  @IsNotEmpty()
  limitOrderMaxAmount: number

  @ApiProperty({ required: false, name: 'order_expire_time' })
  @Expose()
  @IsNotEmpty()
  orderExpireTime: string

  @ApiProperty({ required: false, name: 'order_unit' })
  @Expose()
  @IsNotEmpty()
  orderUnit: number

  @ApiProperty({ required: false, name: 'limit_day_unit' })
  @Expose()
  @IsNotEmpty()
  limitDayUnit: number

  @ApiProperty({ required: false, name: 'limit_order_times' })
  @Expose()
  @IsNotEmpty()
  limitOrderTimes: number

  @ApiProperty({ required: false, name: 'limit_order_amount' })
  @Expose()
  @IsNotEmpty()
  limitOrderAmount: number

  @ApiProperty({ required: false, name: 'stop_threshold_value' })
  @Expose()
  @IsNotEmpty()
  stopThresholdValue: number

  @ApiProperty({ required: false, name: 'restricted_day_unit' })
  @Expose()
  @IsNotEmpty()
  restrictedDayUnit: number

  @ApiProperty({ required: false, name: 'restricted_order_times' })
  @Expose()
  @IsNotEmpty()
  restrictedOrderTimes: number

  @ApiProperty({ required: false, name: 'restricted_day_order_times' })
  @Expose()
  @IsNotEmpty()
  restrictedDayOrderTimes: number

  @ApiProperty({ required: false, name: 'restricted_day_order_amount' })
  @Expose()
  @IsNotEmpty()
  restrictedDayOrderAmount: number

  @ApiProperty({ required: false, name: 'active_threshold_value' })
  @Expose()
  @IsNotEmpty()
  activeThresholdValue: number

  @ApiProperty({ required: false, name: 'restricted_order_amount' })
  @Expose()
  @IsNotEmpty()
  restrictedOrderAmount: number

  @ApiProperty({ required: false, name: 'scaling_value' })
  @Expose()
  @IsNotEmpty()
  scalingValue: number

  @ApiProperty({ required: false, name: 'rank1_scale_bcast' })
  @Expose()
  @IsNotEmpty()
  rank1ScaleBcast: number

  @ApiProperty({ required: false, name: 'rank2_scale_bcast' })
  @Expose()
  @IsNotEmpty()
  rank2ScaleBcast: number

  @ApiProperty({ required: false, name: 'rank3_scale_bcast' })
  @Expose()
  @IsNotEmpty()
  rank3ScaleBcast: number

  @ApiProperty({ required: false, name: 'api_token' })
  @Expose()
  @IsNotEmpty()
  apiToken: string

  @ApiProperty({ required: false, name: 'allow_resell' })
  @Expose()
  @IsNotEmpty()
  allowResell: number

  @ApiProperty({ required: false, name: 'odds_mode' })
  @Expose()
  @IsNotEmpty()
  oddsMode: number

  @ApiProperty({ required: false, name: 'odds_fee' })
  @Expose()
  @IsNotEmpty()
  oddsFee: number

  @ApiProperty({ required: false, name: 'payout_scaling_unit' })
  @Expose()
  @IsNotEmpty()
  payoutScalingUnit: number

  @ApiProperty({ required: false, name: 'order_minimum' })
  @Expose()
  @IsNotEmpty()
  orderMinimum: number

  @ApiProperty({ required: false, name: 'expire_time' })
  @Expose()
  @IsNotEmpty()
  expireTime: number

  @ApiProperty({ required: false, name: 'emergency_threshold' })
  @Expose()
  @IsNotEmpty()
  emergencyThreshold: number

  @ApiProperty({ required: false, name: 'max_usdt_per_order' })
  @Expose()
  @IsNotEmpty()
  maxUsdtPerOrder: number

  @ApiProperty({ required: false, name: 'max_bcast_per_order' })
  @Expose()
  @IsNotEmpty()
  maxBcastPerOrder: number

  @ApiProperty({ required: false, name: 'same_direction_interval' })
  @Expose()
  @IsNotEmpty()
  sameDirectionInterval: number

  @ApiProperty({ required: false, name: 'diff_direction_interval' })
  @Expose()
  @IsNotEmpty()
  diffDirectionInterval: number
}

export class ApiUpdateStatusTradingModeDTO {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty({ required: false, name: 'status' })
  @Expose()
  @IsNotEmpty()
  status: number
}

export class ApiUpdateTradingModeDTO {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty({ required: false, name: 'mode' })
  @Expose()
  @IsNotEmpty()
  mode: string

  @ApiProperty({ required: false, name: 'period' })
  @Expose()
  @IsNotEmpty()
  period: string

  @ApiProperty({ required: false, name: 'start_time' })
  @Expose()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ required: false, name: 'end_time' })
  @Expose()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ required: false, name: 'payout' })
  @Expose()
  @IsNotEmpty()
  payout: number

  @ApiProperty({ required: false, name: 'suggestion_1' })
  @Expose()
  @IsNotEmpty()
  suggestion_1: number

  @ApiProperty({ required: false, name: 'suggestion_2' })
  @Expose()
  @IsNotEmpty()
  suggestion_2: number

  @ApiProperty({ required: false, name: 'suggestion_3' })
  @Expose()
  @IsNotEmpty()
  suggestion_3: number

  @ApiProperty({ required: false, name: 'scaling_active' })
  @Expose()
  @IsNotEmpty()
  scalingActive: number

  @ApiProperty({ required: false, name: 'scaling_bcast' })
  @Expose()
  @IsNotEmpty()
  scalingBcast: number

  @ApiProperty({ required: false, name: 'payout_max' })
  @Expose()
  @IsNotEmpty()
  payoutMax: number

  @ApiProperty({ required: false, name: 'rank_scaling_active' })
  @Expose()
  @IsNotEmpty()
  rankScalingActive: number

  @ApiProperty({ required: false, name: 'limit_order_min' })
  @Expose()
  @IsNotEmpty()
  limitOrderMin: number

  @ApiProperty({ required: false, name: 'limit_order_max' })
  @Expose()
  @IsNotEmpty()
  limitOrderMax: number

  @ApiProperty({ required: false, name: 'limit_order_max_amount' })
  @Expose()
  @IsNotEmpty()
  limitOrderMaxAmount: number

  @ApiProperty({ required: false, name: 'order_expire_time' })
  @Expose()
  @IsNotEmpty()
  orderExpireTime: string

  @ApiProperty({ required: false, name: 'order_unit' })
  @Expose()
  @IsNotEmpty()
  orderUnit: number

  @ApiProperty({ required: false, name: 'limit_day_unit' })
  @Expose()
  @IsNotEmpty()
  limitDayUnit: number

  @ApiProperty({ required: false, name: 'limit_order_times' })
  @Expose()
  @IsNotEmpty()
  limitOrderTimes: number

  @ApiProperty({ required: false, name: 'limit_order_amount' })
  @Expose()
  @IsNotEmpty()
  limitOrderAmount: number

  @ApiProperty({ required: false, name: 'stop_threshold_value' })
  @Expose()
  @IsNotEmpty()
  stopThresholdValue: number

  @ApiProperty({ required: false, name: 'restricted_day_unit' })
  @Expose()
  @IsNotEmpty()
  restrictedDayUnit: number

  @ApiProperty({ required: false, name: 'restricted_order_times' })
  @Expose()
  @IsNotEmpty()
  restrictedOrderTimes: number

  @ApiProperty({ required: false, name: 'restricted_day_order_times' })
  @Expose()
  @IsNotEmpty()
  restrictedDayOrderTimes: number

  @ApiProperty({ required: false, name: 'restricted_day_order_amount' })
  @Expose()
  @IsNotEmpty()
  restrictedDayOrderAmount: number

  @ApiProperty({ required: false, name: 'active_threshold_value' })
  @Expose()
  @IsNotEmpty()
  activeThresholdValue: number

  @ApiProperty({ required: false, name: 'restricted_order_amount' })
  @Expose()
  @IsNotEmpty()
  restrictedOrderAmount: number

  @ApiProperty({ required: false, name: 'scaling_value' })
  @Expose()
  @IsNotEmpty()
  scalingValue: number

  @ApiProperty({ required: false, name: 'rank1_scale_bcast' })
  @Expose()
  @IsNotEmpty()
  rank1ScaleBcast: number

  @ApiProperty({ required: false, name: 'rank2_scale_bcast' })
  @Expose()
  @IsNotEmpty()
  rank2ScaleBcast: number

  @ApiProperty({ required: false, name: 'rank3_scale_bcast' })
  @Expose()
  @IsNotEmpty()
  rank3ScaleBcast: number

  @ApiProperty({ required: false, name: 'api_token' })
  @Expose()
  @IsNotEmpty()
  apiToken: string

  @ApiProperty({ required: false, name: 'allow_resell' })
  @Expose()
  @IsNotEmpty()
  allowResell: number

  @ApiProperty({ required: false, name: 'odds_mode' })
  @Expose()
  @IsNotEmpty()
  oddsMode: number

  @ApiProperty({ required: false, name: 'odds_fee' })
  @Expose()
  @IsNotEmpty()
  oddsFee: number

  @ApiProperty({ required: false, name: 'payout_scaling_unit' })
  @Expose()
  @IsNotEmpty()
  payoutScalingUnit: number

  @ApiProperty({ required: false, name: 'order_minimum' })
  @Expose()
  @IsNotEmpty()
  orderMinimum: number

  @ApiProperty({ required: false, name: 'expire_time' })
  @Expose()
  @IsNotEmpty()
  expireTime: number

  @ApiProperty({ required: false, name: 'emergency_threshold' })
  @Expose()
  @IsNotEmpty()
  emergencyThreshold: number

  @ApiProperty({ required: false, name: 'max_usdt_per_order' })
  @Expose()
  @IsNotEmpty()
  maxUsdtPerOrder: number

  @ApiProperty({ required: false, name: 'max_bcast_per_order' })
  @Expose()
  @IsNotEmpty()
  maxBcastPerOrder: number

  @ApiProperty({ required: false, name: 'same_direction_interval' })
  @Expose()
  @IsNotEmpty()
  sameDirectionInterval: number

  @ApiProperty({ required: false, name: 'diff_direction_interval' })
  @Expose()
  @IsNotEmpty()
  diffDirectionInterval: number

  @ApiProperty({ required: false, name: 'status' })
  @Expose()
  status: number
}

export class ApiDeleteTradingModeDTO {
  @ApiProperty()
  @Expose()
  id: number
}
