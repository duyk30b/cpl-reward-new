import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import { BasePairItemDto } from '@app/common/base-pair-input.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

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

export class DeleteGridTradingRequestDto {
  @Type(() => String)
  @IsString()
  @Expose({ name: 'id' })
  id: string
}

export class DeleteGridTradingResponseDto {
  @Expose({ name: 'status' })
  @ApiProperty({ name: 'status' })
  @Type(() => Number)
  @IsNumber()
  status: number
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

export class GetGridTradingPaginationDto extends BasePaginationQueryDto {
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
    name: 'status',
    nullable: true,
    enum: Object.values(PAIR_STATUS).filter(
      (value) => typeof value === 'number',
    ),
  })
  @Expose({ name: 'status' })
  @IsOptional()
  @IsEnum(PAIR_STATUS)
  @Type(() => Number)
  status?: PAIR_STATUS
}

export class GridTradingSettingItemDto extends BasePairItemDto {
  @Expose({ name: 'id', toPlainOnly: true })
  @ApiProperty({ type: String, name: 'id' })
  @IsNumberString()
  @Type(() => String)
  id: string

  @Expose({ name: 'created_at', toPlainOnly: true })
  @ApiProperty({ type: String, name: 'created_at' })
  @IsNumberString()
  @Type(() => String)
  createdAt: string

  @Expose({ name: 'updated_at', toPlainOnly: true })
  @ApiProperty({ type: String, name: 'updated_at' })
  @IsNumberString()
  @Type(() => String)
  updatedAt: string

  @ApiProperty({ name: 'profit_sharing' })
  @Expose({ name: 'profit_sharing', toPlainOnly: true })
  @Type(() => String)
  profitSharing: string

  @ApiProperty({ name: 'min_grid' })
  @Expose({ name: 'min_grid', toPlainOnly: true })
  @Type(() => Number)
  @IsNumber()
  minGrid: string

  @ApiProperty({ name: 'max_grid' })
  @Expose({ name: 'max_grid', toPlainOnly: true })
  @Type(() => Number)
  @IsNumber()
  maxGrid: string

  @ApiProperty({ name: 'threshold_higher_price' })
  @Expose({ name: 'threshold_higher_price', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  thresholdHigherPrice: string

  @ApiProperty({ name: 'threshold_lower_price' })
  @Expose({ name: 'threshold_lower_price', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  thresholdLowerPrice: string

  @ApiProperty({ name: 'adjust_coefficient' })
  @Expose({ name: 'adjust_coefficient', toPlainOnly: true })
  @Type(() => String)
  @IsNumberString()
  adjustCoefficient: string

  @ApiProperty({ name: 'status' })
  @Expose({ name: 'status', toPlainOnly: true })
  @IsEnum(PAIR_STATUS)
  status: PAIR_STATUS
}

class OrderOfPairRequest {
  @ApiProperty({ type: String, description: 'id of pair' })
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'id' })
  id: string

  @Expose()
  @ApiProperty({ type: Number, description: 'order of pair' })
  @IsNotEmpty()
  @Type(() => Number)
  @Expose({ name: 'index' })
  index: number
}

export class UpdateOrderOfPairRequestDto {
  @Expose({ name: 'data' })
  @ApiProperty({
    type: [OrderOfPairRequest],
    description: 'List data to mark order',
  })
  @Type(() => OrderOfPairRequest)
  @ValidateNested({ each: true })
  data: OrderOfPairRequest[]
}

export class UpdateOrderOfPairResponse extends DeleteGridTradingResponseDto {}

export class GetAllPairNameRequest {}
