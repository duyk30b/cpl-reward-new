import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CATEGORY_STATUS, PAIR_STATUS } from '../../enum'
import { BasePairItemDto } from '../base.dto'
import { SubCategoryResponseDto } from './sub-category.dto'

export class PairItemDto extends BasePairItemDto {
  @ApiProperty({
    enum: Object.values(PAIR_STATUS).filter(
      (value) => typeof value === 'number',
    ),
    example: 0,
    description: `${PAIR_STATUS.DISABLED} is disabled, ${PAIR_STATUS.ENABLED} is enabled`,
    type: Number,
  })
  @Expose({ name: 'status' })
  @IsEnum(PAIR_STATUS)
  @Type(() => Number)
  status: number
}

export class DeletePairCategoryResponseDto {
  @ApiProperty({ name: 'status' })
  @Expose({ name: 'status' })
  @Type(() => Boolean)
  @IsBoolean()
  status: boolean
}

export class UpdatePairCategoryResponseDto extends DeletePairCategoryResponseDto {}
export class UpdateOrderCategoryResponse extends UpdatePairCategoryResponseDto {}

export class PairCategorySettingDto {
  @Type(() => String)
  @IsString()
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string

  @Expose()
  @IsEnum(CATEGORY_STATUS)
  @IsNotEmpty()
  @ApiProperty({ name: 'status', type: Number })
  status: CATEGORY_STATUS = CATEGORY_STATUS.DISABLED

  @Expose({ name: 'language_key', toPlainOnly: true })
  @ApiProperty({ name: 'language_key' })
  @IsString()
  @IsNotEmpty()
  languageKey: string

  @ApiPropertyOptional({
    name: 'sub_category',
    type: [SubCategoryResponseDto],
    nullable: true,
  })
  @Expose({ name: 'sub_category', toPlainOnly: true })
  @Type(() => SubCategoryResponseDto)
  @ValidateNested({ each: true })
  @IsOptional()
  subCategory?: SubCategoryResponseDto[] = []
}
