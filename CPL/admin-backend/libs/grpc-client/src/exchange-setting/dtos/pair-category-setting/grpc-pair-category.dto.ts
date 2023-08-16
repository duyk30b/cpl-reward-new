import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { GrpcBaseResponse } from '../base.dto'
import {
  DeletePairCategorySettingDto,
  GetPairCategorySettingDto,
} from './pair-category-input.dto'
import {
  DeletePairCategoryResponseDto,
  PairCategorySettingDto,
} from './pair-category.dto'

export class DeletePairCategoryRequest extends DeletePairCategorySettingDto {}

export class GetPairCategoryRequest extends GetPairCategorySettingDto {}

export class PairCategorySettingRequest {}

export class PairCategorySettingResponse extends DeletePairCategoryResponseDto {}

export class GrpcPairCategorySetting extends GrpcBaseResponse<
  PairCategorySettingDto[]
> {
  @Type(() => PairCategorySettingDto)
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  @ValidateNested({ each: true })
  data: PairCategorySettingDto[]
}
export class GrpcSinglePairCategorySetting extends GrpcBaseResponse<PairCategorySettingDto> {
  @Type(() => PairCategorySettingDto)
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: PairCategorySettingDto
}

export class GrpcPairCategorySettingPaginationResponse extends BasePaginationDto<
  PairCategorySettingDto[]
> {
  @ApiProperty({ name: 'data', type: [PairCategorySettingDto] })
  @Type(() => PairCategorySettingDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: PairCategorySettingDto[] = []
}
