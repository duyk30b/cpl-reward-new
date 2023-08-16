import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  Min,
} from 'class-validator'
import {
  MAX_DECIMAL_AMOUNT_ROUND,
  MAX_DECIMAL_PRICE_ROUND,
} from '../../constants'
import {
  FeeLimit,
  IsAmountDecimalInArray,
  IsArrayContainDecimal,
  IsDecimalInArray,
  IsDecimalNumber,
  IsGreaterThanDecimalOfAmount,
  IsGreaterThanDecimalOfTotal,
  IsGreaterThanMinimumAmount,
  IsGreaterThanMinimumTotal,
  IsTotalDecimalNumber,
} from '../../exchange-setting.decorator'
import { BasePairItemDto } from '../base.dto'
import {
  CHARGE_BY,
  FEE_TYPE,
  MAXIMUM_NUMBER_OF_DAYS_TO_SAVE_VOLUME,
  PAIR_STATUS,
} from './pair-setting.dto'

export class UpdatePairSettingItemDto extends BasePairItemDto {
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

  @ApiProperty({ name: 'precisions' })
  @Expose({ name: 'precisions' })
  @Type(() => String)
  @IsArray()
  @IsArrayContainDecimal({ message: 'precisions contain wrong value' })
  precisions: string[]

  @ApiProperty({ name: 'default_precision' })
  @Expose({ name: 'default_precision' })
  @Type(() => String)
  @IsString()
  @IsDecimalInArray({ message: 'default precision was not in precision list' })
  defaultPrecision: string

  @ApiProperty({ name: 'minimum_amount' })
  @Expose({ name: 'minimum_amount' })
  @Type(() => String)
  @IsNumberString()
  @IsGreaterThanDecimalOfAmount({
    message: 'minimum amount was greater than decimal of amount',
  })
  @IsDecimalNumber(MAX_DECIMAL_AMOUNT_ROUND, {
    message: 'minimum amount was not decimal number',
  })
  minimumAmount: string

  @ApiProperty({ name: 'minimum_total' })
  @Expose({ name: 'minimum_total' })
  @Type(() => String)
  @IsNumberString()
  @IsGreaterThanDecimalOfTotal()
  @IsTotalDecimalNumber()
  minimumTotal: string

  @ApiProperty({ name: 'decimal_of_price' })
  @Expose({ name: 'decimal_of_price' })
  @Type(() => String)
  @IsNumberString()
  @IsDecimalInArray({ message: 'decimal of price was not in precision list' })
  @IsDecimalNumber(MAX_DECIMAL_PRICE_ROUND, {
    message: 'Decimal of price is invalid',
  })
  decimalOfPrice: string

  @ApiProperty({ name: 'decimal_of_amount' })
  @Expose({ name: 'decimal_of_amount' })
  @Type(() => String)
  @IsNumberString()
  @IsAmountDecimalInArray({
    message: 'decimal of amount was not in precision list',
  })
  decimalOfAmount: string

  @ApiProperty({ name: 'init_price' })
  @Expose({ name: 'init_price' })
  @Type(() => String)
  @IsNumberString()
  @IsDecimalNumber(MAX_DECIMAL_PRICE_ROUND, {
    message: 'Decimal of internal price is invalid',
  })
  initPrice: string

  @ApiProperty({ name: 'n_day_amount_limit' })
  @Expose({ name: 'n_day_amount_limit' })
  @Type(() => String)
  @IsNumberString()
  @IsDecimalNumber(MAX_DECIMAL_AMOUNT_ROUND, {
    message: 'Decimal of nDayAmountLimit is invalid',
  })
  @IsGreaterThanMinimumAmount({
    message: 'This must be greater than or equal to the minimum amount.',
  })
  nDayAmountLimit: string

  @ApiProperty({ name: 'n_day_total_limit' })
  @Expose({ name: 'n_day_total_limit' })
  @Type(() => String)
  @IsNumberString()
  @IsDecimalNumber(MAX_DECIMAL_AMOUNT_ROUND, {
    // max decimal of nDayTotalLimit = max decimal of nDayAmountLimit
    message: 'Decimal of nDayTotalLimit is invalid',
  })
  @IsGreaterThanMinimumTotal({
    message: 'This must be greater than or equal to the minimum total.',
  })
  nDayTotalLimit: string

  @ApiProperty({ name: 'limit_span' })
  @Expose({ name: 'limit_span' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAXIMUM_NUMBER_OF_DAYS_TO_SAVE_VOLUME)
  limitSpan: number

  @ApiProperty({ name: 'buy_fee' })
  @Expose({ name: 'buy_fee' })
  @Type(() => String)
  @IsNumberString()
  @FeeLimit({
    message:
      'Buy fee was greater or equal 0.0001 or equal 0 and less than or equal 100',
  })
  buyFee: string

  @ApiProperty({ name: 'buy_fee_currency' })
  @Expose({ name: 'buy_fee_currency' })
  @Type(() => String)
  @IsString()
  buyFeeCurrency: string

  @ApiProperty({ name: 'buy_fee_type' })
  @Expose({ name: 'buy_fee_type' })
  @Type(() => Number)
  @IsEnum(FEE_TYPE)
  buyFeeType: FEE_TYPE

  @ApiProperty({ name: 'sell_fee' })
  @Expose({ name: 'sell_fee' })
  @Type(() => String)
  @IsNumberString()
  @FeeLimit({
    message:
      'Sell fee was greater or equal 0.0001 or equal 0 and less than or equal 100',
  })
  sellFee: string

  @ApiProperty({ name: 'sell_fee_currency' })
  @Expose({ name: 'sell_fee_currency' })
  @Type(() => String)
  @IsString()
  sellFeeCurrency: string

  @ApiProperty({ name: 'sell_fee_type' })
  @Expose({ name: 'sell_fee_type' })
  @Type(() => Number)
  @IsEnum(FEE_TYPE)
  sellFeeType: FEE_TYPE

  @ApiProperty({
    name: 'init_time',
    description: 'init time must be is number string',
  })
  @Expose({ name: 'init_time' })
  @Type(() => String)
  @IsNotEmpty()
  @IsNumberString()
  initTime: string

  @ApiProperty({ name: 'charge_by' })
  @Expose({ name: 'charge_by' })
  @IsEnum(CHARGE_BY)
  chargeBy: CHARGE_BY
}

export class CreatePairSettingItemDto extends UpdatePairSettingItemDto {}

export class PairSettingItemWithUserDto extends UpdatePairSettingItemDto {
  @Expose({ name: 'user_id' })
  @Type(() => String)
  @IsString()
  userId: string
}
