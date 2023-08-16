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

export class GetPairCategorySettingDto {
  @ApiProperty({ type: String, description: 'id of pair category' })
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'id' })
  id: string
}

export class DeletePairCategorySettingDto extends GetPairCategorySettingDto {}

export class CreatePairCategoryItemDto extends LanguageDto {
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

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ name: 'index' })
  @Expose({ name: 'index' })
  index: string
}

export class UpdatePairCategoryItemDto extends CreatePairCategoryItemDto {
  @Type(() => String)
  @IsString()
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string
}

class OrderCategoryRequest {
  @Expose()
  @ApiProperty({ type: String, description: 'id of pair category' })
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'id' })
  id: string

  @Expose()
  @ApiProperty({ type: Number, description: 'order of pair category' })
  @IsNotEmpty()
  @Type(() => Number)
  @Expose({ name: 'order' })
  index: number
}

export class UpdateOrderCategoryRequestDto {
  @Expose()
  @Type(() => OrderCategoryRequest)
  @ValidateNested({ each: true })
  data: OrderCategoryRequest[]
}
