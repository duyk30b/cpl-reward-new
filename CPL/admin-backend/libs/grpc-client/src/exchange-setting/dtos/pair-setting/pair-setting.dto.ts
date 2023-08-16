import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'
import { BasePairItemDto } from '../base.dto'

export enum OBM_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
}

export enum PAIR_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
}

export enum FEE_TYPE {
  PERCENTAGE = 1,
  NUMBER = 2,
}

export enum CHARGE_BY {
  DEFAULT = 0,
  REWARD = 1,
  CASTLE = 2,
}

export const MAXIMUM_NUMBER_OF_DAYS_TO_SAVE_VOLUME = 7

export class PairSettingParamsDto extends BasePairItemDto {}

export class GetListPairNameRequestDto {}

export class DeletePairSettingParamDto extends BasePairItemDto {
  @Type(() => String)
  @IsString()
  @Expose({ name: 'user_id' })
  userId: string
}

export class PairSettingFilterDto {
  @ApiPropertyOptional({ name: 'coin', nullable: true })
  @Expose({ name: 'coin' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase() || undefined)
  coin?: string

  @ApiPropertyOptional({ name: 'currency', nullable: true })
  @Expose({ name: 'currency' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase() || undefined)
  currency?: string
}

export class GetPairSettingPaginationDto extends BasePaginationQueryDto {
  @ApiPropertyOptional({ name: 'coin', nullable: true })
  @Expose({ name: 'coin' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase() || undefined)
  coin?: string

  @ApiPropertyOptional({ name: 'currency', nullable: true })
  @Expose({ name: 'currency' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase() || undefined)
  currency?: string

  @ApiPropertyOptional({
    name: 'pair_status',
    nullable: true,
    enum: Object.values(PAIR_STATUS).filter(
      (value) => typeof value === 'number',
    ),
  })
  @Expose({ name: 'pair_status' })
  @IsOptional()
  @IsEnum(PAIR_STATUS)
  @Type(() => Number)
  pairStatus?: PAIR_STATUS
}

export class PairSettingItemDto extends BasePairItemDto {
  @Expose({ name: 'created_at', toPlainOnly: true })
  @ApiProperty({ type: String, name: 'created_at' })
  @IsNumberString()
  @Type(() => String)
  createdAt: string

  @ApiProperty({ name: 'precisions' })
  @Expose({ name: 'precisions', toPlainOnly: true })
  @Type(() => String)
  @IsArray()
  precisions: string[]

  @ApiProperty({ name: 'default_precision' })
  @Expose({ name: 'default_precision', toPlainOnly: true })
  @Type(() => String)
  @IsString()
  defaultPrecision: string

  @ApiProperty({ name: 'minimum_amount' })
  @Expose({ name: 'minimum_amount', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  minimumAmount: string

  @ApiProperty({ name: 'minimum_total' })
  @Expose({ name: 'minimum_total', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  minimumTotal: string

  @ApiProperty({ name: 'decimal_of_price' })
  @Expose({ name: 'decimal_of_price', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  decimalOfPrice: string

  @ApiProperty({ name: 'decimal_of_amount' })
  @Expose({ name: 'decimal_of_amount', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  decimalOfAmount: string

  @ApiProperty({ name: 'init_price' })
  @Expose({ name: 'init_price', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  initPrice: string

  @ApiProperty({ name: 'n_day_amount_limit' })
  @Expose({ name: 'n_day_amount_limit', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  nDayAmountLimit: string

  @ApiProperty({ name: 'n_day_total_limit' })
  @Expose({ name: 'n_day_total_limit', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  nDayTotalLimit: string

  @ApiProperty({ name: 'limit_span' })
  @Expose({ name: 'limit_span', toPlainOnly: true })
  @Type(() => Number)
  @IsNumber()
  limitSpan: number

  @ApiProperty({ name: 'buy_fee' })
  @Expose({ name: 'buy_fee', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  buyFee: string

  @ApiProperty({ name: 'buy_fee_currency' })
  @Expose({ name: 'buy_fee_currency', toPlainOnly: true })
  @Type(() => String)
  @IsString()
  buyFeeCurrency: string

  @ApiProperty({ name: 'buy_fee_type' })
  @Expose({ name: 'buy_fee_type', toPlainOnly: true })
  @IsEnum(FEE_TYPE)
  @Type(() => Number)
  buyFeeType: FEE_TYPE

  @ApiProperty({ name: 'sell_fee' })
  @Expose({ name: 'sell_fee', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  sellFee: string

  @ApiProperty({ name: 'sell_fee_currency' })
  @Expose({ name: 'sell_fee_currency', toPlainOnly: true })
  @Type(() => String)
  @IsString()
  sellFeeCurrency: string

  @ApiProperty({ name: 'sell_fee_type' })
  @Expose({ name: 'sell_fee_type', toPlainOnly: true })
  @IsEnum(FEE_TYPE)
  @Type(() => Number)
  sellFeeType: FEE_TYPE

  @ApiProperty({ name: 'init_time' })
  @Expose({ name: 'init_time', toPlainOnly: true })
  @Type(() => String)
  initTime: string

  @ApiProperty({ name: 'charge_by' })
  @Expose({ name: 'charge_by', toPlainOnly: true })
  @IsEnum(CHARGE_BY)
  chargeBy: CHARGE_BY
}

export class EditPairSettingItemDto extends PairSettingItemDto {}

export class PairSettingWithOBMDto extends PairSettingItemDto {
  @ApiProperty({ name: 'precisions_obm', type: [String] })
  @Expose({ name: 'precisions_obm', toPlainOnly: true })
  @Type(() => String)
  @IsArray()
  precisionsObm: string[] = []

  @ApiProperty({
    name: 'obm_active',
    enum: Object.values(OBM_STATUS).filter(
      (value) => typeof value === 'number',
    ),
    example: 0,
    description: `${OBM_STATUS.INACTIVE} is inactive, ${OBM_STATUS.ACTIVE} is active`,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Expose({ name: 'obm_active', toPlainOnly: true })
  obmActive: OBM_STATUS
}
