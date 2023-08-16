import { BasePairItemDto } from '@app/common/base-pair-input.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsEnum, IsNumber, IsNumberString } from 'class-validator'
import { PAIR_STATUS } from './grid-trading.dto'

export class BaseGridTradingSettingItemDto extends BasePairItemDto {
  @Expose({ name: 'status' })
  @ApiProperty({
    name: 'status',
    type: Number,
    enum: Object.values(PAIR_STATUS).filter(
      (value) => typeof value === 'number',
    ),
    description: `${PAIR_STATUS.INACTIVE} is inactive, ${PAIR_STATUS.ACTIVE} is active`,
  })
  @IsEnum(PAIR_STATUS)
  status: PAIR_STATUS

  @ApiProperty({ name: 'profit_sharing' })
  @Expose({ name: 'profit_sharing' })
  @Type(() => String)
  @IsNumberString()
  profitSharing: string

  @ApiProperty({ name: 'max_grid' })
  @Expose({ name: 'max_grid' })
  @Type(() => Number)
  @IsNumber()
  maxGrid: number

  @ApiProperty({ name: 'min_grid' })
  @Expose({ name: 'min_grid' })
  @Type(() => Number)
  @IsNumber()
  minGrid: number

  @ApiProperty({ name: 'threshold_higher_price' })
  @Expose({ name: 'threshold_higher_price' })
  @Type(() => String)
  @IsNumberString()
  thresholdHigherPrice: string

  @ApiProperty({ name: 'threshold_lower_price' })
  @Expose({ name: 'threshold_lower_price' })
  @Type(() => String)
  @IsNumberString()
  thresholdLowerPrice: string

  @ApiProperty({ name: 'adjust_coefficient' })
  @Expose({ name: 'adjust_coefficient' })
  @Type(() => String)
  @IsNumberString()
  adjustCoefficient: string

  @ApiProperty({ name: 'index' })
  @Expose({ name: 'index' })
  @Type(() => Number)
  @IsNumber()
  index: string
}

export class UpdateGridTradingSettingItemDto extends BaseGridTradingSettingItemDto {}

export class CreateGridTradingSettingItemDto extends BaseGridTradingSettingItemDto {}
