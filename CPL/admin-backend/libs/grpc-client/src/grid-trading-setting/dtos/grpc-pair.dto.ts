import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { BasePairItemDto } from '@app/common/base-pair-input.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { GrpcBaseResponse } from './base.dto'
import { GridTradingSettingItemDto } from './grid-trading.dto'

export class GetGridTradingSettingFilterRequest {}

export class GrpcGridTradingSettingDto extends GrpcBaseResponse<
  GridTradingSettingItemDto[]
> {
  @Type(() => GridTradingSettingItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: GridTradingSettingItemDto[]
}

export class GrpcGridTradingSettingPaginationResponse extends BasePaginationDto<
  GridTradingSettingItemDto[]
> {
  @ApiProperty({ name: 'data', type: [GridTradingSettingItemDto] })
  @Expose({ name: 'data' })
  @Type(() => GridTradingSettingItemDto)
  @ValidateNested({ each: true })
  data: GridTradingSettingItemDto[] = []
}

export class GrpcListPairNameResponse extends GrpcBaseResponse<
  BasePairItemDto[]
> {
  @ApiProperty({ name: 'data', type: [BasePairItemDto] })
  @Expose({ name: 'data' })
  @Type(() => BasePairItemDto)
  @ValidateNested({ each: true })
  data: BasePairItemDto[] = []
  name = 'Get all pair name'
}
