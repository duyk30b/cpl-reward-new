import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { BasePairItemDto, GrpcBaseResponse } from '../base.dto'
import {
  PairSettingFilterDto,
  PairSettingItemDto,
  PairSettingWithOBMDto,
} from './pair-setting.dto'

export class GetPairSettingFilterRequest extends PairSettingFilterDto {}

export class GrpcPairSettingDto extends GrpcBaseResponse<
  PairSettingWithOBMDto[]
> {
  @Type(() => PairSettingItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: PairSettingWithOBMDto[]
}

export class GrpcSinglePairSettingResponse extends GrpcBaseResponse<PairSettingWithOBMDto> {
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  @Type(() => PairSettingWithOBMDto)
  @ValidateNested()
  data: PairSettingWithOBMDto
}

export class GrpcPairSettingPaginationResponse extends BasePaginationDto<
  PairSettingWithOBMDto[]
> {
  @ApiProperty({ name: 'data', type: [PairSettingWithOBMDto] })
  @Expose({ name: 'data' })
  @Type(() => PairSettingWithOBMDto)
  @ValidateNested({ each: true })
  data: PairSettingWithOBMDto[] = []
}

export class GrpcListPairNameResponse extends GrpcBaseResponse<
  BasePairItemDto[]
> {
  @ApiProperty({ name: 'data', type: [BasePairItemDto] })
  @Expose({ name: 'data' })
  @Type(() => BasePairItemDto)
  @ValidateNested({ each: true })
  data: BasePairItemDto[] = []
}
