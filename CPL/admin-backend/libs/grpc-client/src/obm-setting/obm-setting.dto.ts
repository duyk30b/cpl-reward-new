import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import {
  IsEnum,
  IsInstance,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { IsNumberRange } from './min-max-number'
import {
  ExchangeStatus,
  ObmExchange,
  ObmModule,
  PairStatus,
  PrecisionsList,
} from './obm-setting.enum'

@Exclude()
export class OBMPairParams {
  @Expose()
  @ApiProperty({
    required: true,
    description: 'bot_a,bot_p,crawler,merge_orderbook',
  })
  @IsEnum(ObmModule, { message: 'module: bot_a,bot_p,crawler,merge_orderbook' })
  module: string

  @Expose()
  @ApiProperty({
    required: true,
    description: 'binance,ftx',
  })
  @IsEnum(ObmExchange, { message: 'exhange: binance, ftx' })
  exchange: string

  @Expose()
  @ApiPropertyOptional()
  coin?: string

  @Expose()
  @ApiPropertyOptional()
  currency?: string
}

@Exclude()
export class OBMSystemTargetParams {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ObmExchange, { message: 'exhange: binance, ftx' })
  exchange?: string

  @Expose()
  @ApiPropertyOptional()
  coin?: string

  @Expose()
  @ApiPropertyOptional()
  currency?: string
}

@Exclude()
export class OBMExchangeParams {
  @Expose()
  @IsOptional()
  @IsEnum(ObmExchange, { message: 'exchange: binance, ftx' })
  @ApiPropertyOptional()
  exchange?: string
}
@Exclude()
export class ModuleValue {
  @Expose()
  key: string

  @Expose()
  name: string

  @Expose()
  value: string

  @Expose()
  type: string
}

export class bodyGeneric<T> {
  @Expose()
  name: string

  @Expose()
  data: T
}

@Exclude()
export class ObmBotASetting {
  @Expose({ name: 'min_amount' })
  @ApiPropertyOptional({ name: 'min_amount' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `min_amount must be 0.00000001 - 100000000000`,
  })
  minAmount?: string = '10'

  @Expose({ name: 'max_amount' })
  @ApiPropertyOptional({ name: 'max_amount' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `max_amount must be 0.00000001 - 100000000000`,
  })
  maxAmount?: string = '20'

  @Expose({ name: 'min_total' })
  @ApiPropertyOptional({ name: 'min_total' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `min_total must be 0.00000001 - 100000000000`,
  })
  minTotal?: string = '10'

  @Expose({ name: 'max_total' })
  @ApiPropertyOptional({ name: 'max_total' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `max_total must be 0.00000001 - 100000000000`,
  })
  maxTotal?: string = '20'
}

@Exclude()
export class ObmBotPSetting {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2)
  action?: number = 1

  @Expose({ name: 'volume_scale' })
  @ApiPropertyOptional({ name: 'volume_scale' })
  @IsOptional()
  @IsNumberRange(0, 1, {
    message: `volume_scale must be 0 - 1`,
  })
  volumeScale?: number = 0.1

  @Expose({ name: 'min_total' })
  @ApiPropertyOptional({ name: 'min_total' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `min_total must be 0.00000001 - 100000000000`,
  })
  minTotal?: string = '10'

  @Expose({ name: 'max_total' })
  @ApiPropertyOptional({ name: 'max_total' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `max_total must be 0.00000001 - 100000000000`,
  })
  maxTotal?: string = '20'

  @Expose({ name: 'min_amount' })
  @ApiPropertyOptional({ name: 'min_amount' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `min_amount must be 0.00000001 - 100000000000`,
  })
  minAmount?: string = '10'

  @Expose({ name: 'max_amount' })
  @ApiPropertyOptional({ name: 'max_amount' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `max_amount must be 0.00000001 - 100000000000`,
  })
  maxAmount?: string = '20'

  @Expose({ name: 'order_period' })
  @ApiPropertyOptional({ name: 'order_period' })
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(5, 59, {
    message: `round_digits must be 5 - 59`,
  })
  orderPeriod?: string = '12'

  @Expose({ name: 'skip_min_amount_rate' })
  @ApiPropertyOptional({ name: 'skip_min_amount_rate' })
  @IsOptional()
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `max_amount must be 0.00000001 - 100000000000`,
  })
  skipMinAmountRate?: string = '0.5'
}

@Exclude()
export class ObmCrawlerSetting {
  @Expose({ name: 'adjustment_rate' })
  @ApiPropertyOptional({ name: 'adjustment_rate' })
  @IsOptional()
  @IsNumberString()
  adjustmentRate?: string = '0.2'

  @Expose({ name: 'commission_fee' })
  @ApiPropertyOptional({ name: 'commission_fee' })
  @IsOptional()
  @IsNumberString()
  commissionFee?: string = '0.1'

  @Expose({ name: 'round_digits' })
  @IsOptional()
  @ApiPropertyOptional({ name: 'round_digits' })
  @IsNumberString()
  @IsNumberRange(0, 8, {
    message: `round_digits must be 0 - 8`,
  })
  roundDigits?: string = '2'
}

@Exclude()
export class ObmMergeOrderbookSetting {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PrecisionsList)
  default_precision?: string = '0.01'

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PrecisionsList, { each: true })
  precisions?: string[] = ['0.01']

  @Expose({ name: 'min_amount' })
  @IsOptional()
  @ApiPropertyOptional({ name: 'min_amount' })
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `min_amount must be 0.00000001 - 100000000000`,
  })
  minAmount?: string = '10'

  @Expose({ name: 'max_amount' })
  @IsOptional()
  @ApiPropertyOptional({ name: 'max_amount' })
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `max_amount must be 0.00000001 - 100000000000`,
  })
  maxAmount?: string = '20'

  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  @IsEnum(PrecisionsList, { message: 'precision must be 1 -> 0.00000001' })
  decimal?: string = '0.01'

  @Expose({ name: 'limit_order' })
  @IsOptional()
  @ApiPropertyOptional({ name: 'limit_order' })
  @IsNumberString()
  @IsNumberRange(1, 100, {
    message: `limit_order must be 1 - 100`,
  })
  limitOrder?: string = '100'

  @Expose({ name: 'threshold_price_buy' })
  @IsOptional()
  @ApiPropertyOptional({ name: 'threshold_price_buy' })
  @IsNumberString()
  @IsNumberRange(1, 100, {
    message: `threshold_price_buy must be 1 - 100`,
  })
  thresholdPriceBuy?: string = '50'

  @Expose({ name: 'threshold_price_sell' })
  @IsOptional()
  @ApiPropertyOptional({ name: 'threshold_price_sell' })
  @IsNumberString()
  @IsNumberRange(1, 100, {
    message: `threshold_price_sell must be 1 - 100`,
  })
  thresholdPriceSell?: string = '100'

  @Expose({ name: 'threshold_volume_buy' })
  @IsOptional()
  @ApiPropertyOptional({ name: 'threshold_volume_buy' })
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `threshold_volume_buy must be 0.00000001 - 100000000000`,
  })
  thresholdVolumeBuy?: string = '10'

  @Expose({ name: 'threshold_volume_sell' })
  @IsOptional()
  @ApiPropertyOptional({ name: 'threshold_volume_sell' })
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `threshold_volume_sell must be 0.00000001 - 100000000000`,
  })
  thresholdVolumeSell?: string = '20'
}

@Exclude()
export class ObmNotificationThresholdSetting {
  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  @IsNumberString()
  @IsNumberRange(0, 100000000000, {
    message: `min must be 0 - 100000000000`,
  })
  min?: string = '10000'

  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  @IsNumberString()
  @IsNumberRange(0, 100000000000, {
    message: `max must be 0 - 100000000000`,
  })
  max?: string = '20000'
}

@Exclude()
export class ObmPairSettingItem {
  @ApiProperty({
    required: true,
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase() || '')
  coin: string

  @ApiProperty({
    required: true,
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase() || '')
  currency: string

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsEnum(ObmExchange, { message: 'exchange : binance, ftx' })
  @Transform(({ value }) => value?.toLowerCase())
  exchange?: string

  @ApiPropertyOptional({ name: 'exchange_priority' })
  @Expose({ name: 'exchange_priority' })
  @IsOptional()
  @IsInt()
  exchangePriority?: number

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsInt()
  @IsEnum(PairStatus, { message: 'status: 1,2,5' })
  status?: number

  @ApiPropertyOptional({ name: 'bot_a' })
  @Expose({ name: 'bot_a' })
  @IsOptional()
  @Type(() => ObmBotASetting)
  @ValidateNested({ each: true })
  botA?: ObmBotASetting

  @ApiPropertyOptional({ name: 'bot_p' })
  @Expose({ name: 'bot_p' })
  @IsOptional()
  @Type(() => ObmBotPSetting)
  @ValidateNested({ each: true })
  botP?: ObmBotPSetting

  @ApiPropertyOptional({ name: 'crawler' })
  @Expose({ name: 'crawler' })
  @IsOptional()
  @Type(() => ObmCrawlerSetting)
  @ValidateNested({ each: true })
  crawler?: ObmCrawlerSetting

  @ApiPropertyOptional({ name: 'merge_orderbook' })
  @Expose({ name: 'merge_orderbook' })
  @IsOptional()
  @Type(() => ObmMergeOrderbookSetting)
  @ValidateNested({ each: true })
  mergeOrderbook?: ObmMergeOrderbookSetting

  @ApiPropertyOptional({ name: 'notification_threshold' })
  @Expose({ name: 'notification_threshold' })
  @IsOptional()
  @Type(() => ObmNotificationThresholdSetting)
  @ValidateNested({ each: true })
  notificationThreshold?: ObmNotificationThresholdSetting

  @ApiProperty({
    required: true,
    name: 'update_by',
  })
  @Expose({ name: 'update_by' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase() || '')
  updateBy: string
}

@Exclude()
export class ObmPairSettingDTO {
  @Expose()
  @ApiProperty({
    default: 'update_pair',
  })
  name: string

  @Expose()
  @ApiProperty({
    default: [
      {
        coin: 'bch',
        currency: 'usdt',
        exchange: 'ftx',
        exchange_priority: 3,
        status: 1,
        update_by: 'admin',
        bot_a: {
          min_amount: '10',
          max_amount: '10',
          min_total: '10',
          max_total: '10',
        },
        bot_p: {
          min_amount: '10',
          max_amount: '10',
          min_total: '10',
          max_total: '10',
          action: 1,
          volume_scale: 0.3,
          order_period: 14,
        },
        crawler: {
          adjustment_rate: 0.2,
          commission_fee: 0.1,
          round_digits: 4,
        },
        merge_orderbook: {
          default_precision: '0.1',
          precisions: ['0.1'],
          min_amount: '10',
          max_amount: '10',
          decimal: '0.01',
          limit_order: 100,
          threshold_price_buy: 10,
          threshold_price_sell: 10,
          threshold_volume_buy: '10',
          threshold_volume_sell: '10',
        },
        notification_threshold: {
          min: '10',
          max: '10',
        },
      },
    ],
  })
  @IsInstance(ObmPairSettingItem, { each: true })
  @ValidateNested({ each: true })
  @Type(() => ObmPairSettingItem)
  data: ObmPairSettingItem[]
}

@Exclude()
export class BalanceSetting {
  @Expose()
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  token: string

  @Expose()
  @ApiPropertyOptional()
  @IsNumberString()
  @IsNumberRange(0, 100000000000, {
    message: `alert must be 0 - 100000000000`,
  })
  alert? = '100'

  @Expose()
  @ApiPropertyOptional()
  @IsNumberString()
  @IsNumberRange(0, 100000000000, {
    message: `stop must be 0 - 100000000000`,
  })
  stop? = '10'

  @Expose()
  @ApiPropertyOptional()
  @IsNumberString()
  @IsNumberRange(0, 100, {
    message: `adjust_balance_percent must be 0 - 100`,
  })
  adjustBalancePercent? = '10'
}

@Exclude()
export class ObmExchangeSettingItem {
  @Expose()
  @ApiProperty({
    required: true,
  })
  @IsEnum(ObmExchange, { message: 'exhange: binance, ftx' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase() || '')
  exchange: string

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ExchangeStatus, { message: 'status: 1,2,3,7' })
  status?: number

  @Expose({ name: 'update_by' })
  @IsNotEmpty()
  updateBy: string

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => BalanceSetting)
  @ValidateNested({ each: true })
  balances?: BalanceSetting[]
}

@Exclude()
export class ObmExchangeSettingDTO {
  @Expose()
  @ApiProperty({
    default: 'update_exchange',
  })
  name: string

  @Expose()
  @ApiProperty({
    default: [
      {
        exchange: 'binance',
        status: 1,
        update_by: 'admin',
        balances: [
          {
            token: 'eth',
            alert: '10',
            stop: '100',
          },
        ],
      },
    ],
  })
  @IsInstance(ObmExchangeSettingItem, { each: true })
  @ValidateNested({ each: true })
  @Type(() => ObmExchangeSettingItem)
  data: ObmExchangeSettingItem[]
}
