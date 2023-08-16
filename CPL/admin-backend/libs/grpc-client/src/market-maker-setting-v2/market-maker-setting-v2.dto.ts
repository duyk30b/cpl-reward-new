import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInstance,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { IsNumberRange } from '../obm-setting/min-max-number'
import { PrecisionsList } from '../obm-setting/obm-setting.enum'
import { MarketMakerExchangeStatusEnum } from './constant'

@Exclude()
export class MarketMakerPair {
  @ApiProperty({ name: 'coin', required: true })
  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  @IsNotEmpty()
  coin: string

  @ApiProperty({ name: 'currency', required: true })
  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  @IsNotEmpty()
  currency: string
}

@Exclude()
export class MarketMakerSettingParams extends MarketMakerPair {
  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  @IsNotEmpty()
  exchange: string
}

@Exclude()
export class MarketMakerConfigSetting {
  @Expose()
  @IsOptional()
  @IsEnum(PrecisionsList)
  price_precision?: string = '0.01'

  @Expose()
  @IsOptional()
  @IsEnum(PrecisionsList)
  volume_precision?: string = '0.01'

  @Expose()
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  min_total? = '15'

  @Expose()
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  min_amount? = '0.15'

  @Expose()
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  max_amount? = '1'

  @Expose()
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  spread_price? = '0.5'

  @Expose()
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  volume_scale? = '0.005'

  @Expose()
  @IsOptional()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  order_count_package? = '4'

  @Expose()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  active_flag? = false

  @Expose()
  @IsOptional()
  @IsEnum(MarketMakerExchangeStatusEnum)
  @IsInt()
  @Transform(({ value }) =>
    value ? value : MarketMakerExchangeStatusEnum.UNKNOWN,
  )
  status?: MarketMakerExchangeStatusEnum
}

@Exclude()
export class GrpcMarketMakerSettingItem {
  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  @IsInstance(MarketMakerConfigSetting)
  @ValidateNested({ each: true })
  @Type(() => MarketMakerConfigSetting)
  configure?: MarketMakerConfigSetting
}

@Exclude()
export class MarketMakerSettingV2 extends GrpcMarketMakerSettingItem {
  @Expose()
  exchange: string
}

export class MarketMakerSetting {
  @Expose()
  name? = 'market_maker_setting'

  @Expose()
  bot_id? = ''

  @Expose()
  @IsInstance(MarketMakerSettingV2)
  @ValidateNested({ each: true })
  @Type(() => MarketMakerSettingV2)
  data?: MarketMakerSettingV2
}

@Exclude()
export class GetSystemTargetParams {
  @ApiProperty({ name: 'coin', required: false })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  coin: string

  @ApiProperty({ name: 'currency', required: false })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  currency: string

  @ApiProperty({ name: 'exchange', required: false })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  exchange: string
}

@Exclude()
export class MarketMakerPairSystemTargetItem {
  @Expose()
  exchange: string

  @Expose()
  status: number

  @Expose()
  active_flag: boolean
}

@Exclude()
export class MarketMakerPairSystemTarget {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketMakerPairSystemTargetItem)
  data: MarketMakerPairSystemTargetItem[]
}

@Exclude()
export class MarketMakerSystemTargetResponse {
  @Expose()
  name? = 'market_maker_system_target'

  @Expose()
  data?: {
    [key: string]: MarketMakerPairSystemTarget
  }
}

@Exclude()
export class UpdateMarketMakerSettings {
  @Expose()
  name? = 'update_market_maker_settings'

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketMakerSettingV2)
  data: MarketMakerSettingV2[]
}

@Exclude()
export class UpdateMarketMakerSettingsResponseItem extends MarketMakerSettingParams {}

@Exclude()
export class UpdateMarketMakerSettingsResponse {
  @Expose()
  name? = 'update_market_maker_settings'

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMarketMakerSettingsResponseItem)
  data: UpdateMarketMakerSettingsResponseItem[]
}
