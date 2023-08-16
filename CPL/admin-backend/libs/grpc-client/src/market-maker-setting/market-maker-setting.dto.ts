import { Exclude, Expose, Transform, Type } from 'class-transformer'
import {
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsNumberString,
  ValidateNested,
} from 'class-validator'
import { IsNumberRange } from '../obm-setting/min-max-number'
import { PrecisionsList } from '../obm-setting/obm-setting.enum'

@Exclude()
export class MarketMakerSettingParams {
  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  @IsNotEmpty()
  coin: string

  @Expose()
  @Transform(({ value }) => (value ? value.toLowerCase() : undefined))
  @IsNotEmpty()
  currency: string
}

@Exclude()
export class MarketMakerConfigSetting {
  @Expose()
  @IsEnum(PrecisionsList)
  price_precision?: string = '0.01'

  @Expose()
  @IsEnum(PrecisionsList)
  volume_precision?: string = '0.01'

  @Expose()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  min_total? = '15'

  @Expose()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  min_amount? = '0.15'

  @Expose()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  max_amount? = '1'

  @Expose()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  spread_price? = '0.5'

  @Expose()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  volume_scale? = '0.005'

  @Expose()
  @IsNumberString()
  @IsNumberRange(0.00000001, 100000000000, {
    message: `value must be 0.00000001 - 100000000000`,
  })
  @Transform(({ value }) => (value ? String(value) : undefined))
  order_count_package? = '4'
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

export class MarketMakerSetting {
  @Expose()
  name? = 'market_maker_setting'

  @Expose()
  bot_id? = ''

  @Expose()
  @IsInstance(GrpcMarketMakerSettingItem)
  @ValidateNested({ each: true })
  @Type(() => GrpcMarketMakerSettingItem)
  data?: GrpcMarketMakerSettingItem
}
