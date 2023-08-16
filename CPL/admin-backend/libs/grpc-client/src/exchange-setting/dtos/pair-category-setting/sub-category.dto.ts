import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CATEGORY_STATUS } from '../../enum'
import { PairItemDto } from './pair-category.dto'

export class DeleteSubPairCategoryResponse {
  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean
}
export class UpdateOrderSubCategoryResponse extends DeleteSubPairCategoryResponse {}

export class SubCategoryResponseDto {
  @Type(() => String)
  @IsString()
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string

  @ApiProperty({ name: 'parent_id' })
  @Expose({ name: 'parent_id', toPlainOnly: true })
  @Type(() => String)
  parentId: string

  @ApiProperty({ name: 'language_key' })
  @Expose({ name: 'language_key', toPlainOnly: true })
  @Type(() => String)
  @IsString()
  languageKey: string

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
}
