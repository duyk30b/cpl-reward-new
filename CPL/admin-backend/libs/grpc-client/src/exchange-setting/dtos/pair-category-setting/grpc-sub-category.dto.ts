import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { SubCategoryResponseDto } from './sub-category.dto'

export class GrpcSubPairCategoryResponse {
  @ApiProperty({ name: 'data', type: [SubCategoryResponseDto] })
  @Type(() => SubCategoryResponseDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: SubCategoryResponseDto[] = []
}
