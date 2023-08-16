import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator'
import { GRID_TYPE, SEARCH_BY_FIELD, SORT_TYPE, STRATEGY_STATUS } from '../enum'

export class GetGridTradingRequestDto {
  @ApiPropertyOptional({ name: 'coin' })
  @Expose({ name: 'coin' })
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @IsOptional()
  @ValidateIf((o) => o.currency)
  coin?: string

  @ApiPropertyOptional({ name: 'currency' })
  @Expose({ name: 'currency' })
  @IsString()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @IsOptional()
  @ValidateIf((o) => o.coin)
  currency?: string

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    enum: Object.values(STRATEGY_STATUS).filter(
      (value) => typeof value === 'number',
    ),
    description: `${STRATEGY_STATUS.PENDING} is pending,
    ${STRATEGY_STATUS.RUNNING} is running,
    ${STRATEGY_STATUS.ENDING} is ending, ${STRATEGY_STATUS.END} is end,
    ${STRATEGY_STATUS.ERROR} is error`,
  })
  @Type(() => Number)
  @IsEnum(STRATEGY_STATUS)
  @IsOptional()
  status?: STRATEGY_STATUS

  @ApiPropertyOptional()
  @Expose()
  @Type(() => String)
  @IsNumberString()
  @IsOptional()
  @ValidateIf((o) => o.to)
  from?: string

  @ApiPropertyOptional()
  @Expose()
  @Type(() => String)
  @IsNumberString()
  @IsOptional()
  @ValidateIf((o) => o.from)
  to?: string

  @ApiPropertyOptional({
    enum: Object.values(GRID_TYPE).filter((value) => typeof value === 'number'),
    description: `${GRID_TYPE.ARITHMETIC} is ARITHMETIC, ${GRID_TYPE.GEOMETRIC} is GEOMETRIC`,
  })
  @Expose()
  @Type(() => Number)
  @IsEnum(GRID_TYPE)
  @IsOptional()
  type?: GRID_TYPE

  @ApiPropertyOptional({
    name: 'search_by_field',
    enum: Object.values(SEARCH_BY_FIELD).filter(
      (value) => typeof value === 'number',
    ),
    description: `${SEARCH_BY_FIELD.BOT_ID} search by bot_id, ${SEARCH_BY_FIELD.EMAIL} search by email`,
  })
  @Expose({ name: 'search_by_field' })
  @Type(() => Number)
  @IsEnum(SEARCH_BY_FIELD)
  @IsOptional()
  searchByField?: SEARCH_BY_FIELD

  @ApiPropertyOptional()
  @Expose()
  @Type(() => String)
  @IsOptional()
  keyword?: string

  @ApiPropertyOptional({ default: 1 })
  @Expose()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1

  @ApiPropertyOptional({ name: 'per_page', default: 25 })
  @Expose({ name: 'per_page' })
  @Type(() => Number)
  @IsOptional()
  perPage?: number = 25

  @ApiPropertyOptional({ name: 'sort_by' })
  @Expose({ name: 'sort_by' })
  @Type(() => String)
  @IsOptional()
  sortBy?: string

  @ApiPropertyOptional({
    name: 'sort_type',
    enum: Object.values(SORT_TYPE).filter((value) => typeof value === 'number'),
    description: `${SORT_TYPE.DESC} is descending, ${SORT_TYPE.ASC} is ascending`,
  })
  @Expose({ name: 'sort_type' })
  @Type(() => Number)
  @IsEnum(SORT_TYPE)
  @IsOptional()
  sortType?: SORT_TYPE = SORT_TYPE.DESC
}

export class GrpcGetGridDetailRequestDto {
  @ApiPropertyOptional({ name: 'strategy_id' })
  @Expose({ name: 'strategy_id' })
  @IsNumberString()
  strategyId: string

  @ApiPropertyOptional({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsNumberString()
  userId: string
}

export class GrpcOpenOrderRequestDto {
  @Expose({ name: 'strategy_id' })
  @IsNumberString()
  strategyId: string
}

export class GrpcGetTradeHistoryRequestDto {
  @Expose({ name: 'strategy_id' })
  @ApiProperty({ name: 'strategy_id' })
  strategyId: string

  @ApiPropertyOptional({ name: 'from', description: 'strategy id' })
  @Expose({ name: 'from' })
  @IsNumberString()
  @IsOptional()
  from?: string

  @ApiPropertyOptional({ name: 'to', description: 'strategy id' })
  @Expose({ name: 'to' })
  @IsNumberString()
  @IsOptional()
  to?: string

  @ApiProperty({
    name: 'take',
    example: `${25}`,
    description: `Default is ${25}. For pagination`,
  })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Max(25)
  @Min(1)
  take?: number = 25
}

export class GrpcGetTradeHistorySummaryRequestDto {
  @Expose({ name: 'strategy_id' })
  @ApiProperty({ name: 'strategy_id' })
  @IsNumberString()
  @IsNotEmpty()
  strategyId: string

  @Expose({ name: 'user_id' })
  @ApiProperty({ name: 'user_id' })
  @IsNumberString()
  @IsNotEmpty()
  userId: string
}
