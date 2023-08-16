import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CATEGORY_STATUS } from '../../enum'
import { LanguageDto } from '../../language.dto'
import { UpdateOrderCategoryRequestDto } from './pair-category-input.dto'
import { PairItemDto } from './pair-category.dto'

export class GetSubCategoryByParentId {
  @Expose({ name: 'parent_id' })
  @ApiProperty({ name: 'parent_id', type: String })
  @IsString()
  @IsNotEmpty()
  parentId: string
}

export class GetPairCategorySettingDto {
  @ApiProperty({ type: String, description: 'id of sub pair category' })
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'id' })
  id: string
}

export class DeleteSubCategoryDto {
  @ApiProperty({ type: String, description: 'id of sub pair category' })
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'id' })
  id: string
}

export class BaseSubCategoryRequestDto extends LanguageDto {
  @ApiProperty({ name: 'parent_id' })
  @Expose({ name: 'parent_id' })
  @Type(() => String)
  parentId: string

  @ApiProperty({
    enum: Object.values(CATEGORY_STATUS).filter(
      (value) => typeof value === 'number',
    ),
    example: 0,
    description: `${CATEGORY_STATUS.DISABLED} is disabled, ${CATEGORY_STATUS.ENABLED} is enabled`,
    type: Number,
  })
  @Expose({ name: 'status' })
  @IsEnum(CATEGORY_STATUS)
  @Type(() => Number)
  status: number

  @ApiProperty({ name: 'pairs', type: [PairItemDto] })
  @Expose({ name: 'pairs' })
  @Type(() => PairItemDto)
  @ValidateNested({ each: true })
  pairs: PairItemDto[]

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ name: 'index' })
  @Expose({ name: 'index' })
  index: number
}

export class CreateSubCategoryRequestDto extends BaseSubCategoryRequestDto {}
export class UpdateSubCategoryRequestDto extends BaseSubCategoryRequestDto {
  @ApiProperty({ type: String, description: 'id of sub pair category' })
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'id' })
  id: string
}

export class UpdateOrderSubCategoryRequestDto extends UpdateOrderCategoryRequestDto {}
