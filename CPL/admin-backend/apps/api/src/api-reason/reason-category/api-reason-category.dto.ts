import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { JsonNameInterface } from '@lib/grpc-client/reason/interfaces/json-name.interface'
import { ReasonCategoryTypeEnum } from '@lib/grpc-client/reason/reason-category.enum'
import { ReasonDto } from '../reason/api-reason.dto'

export class ReasonCategoryFilterDto {
  @ApiProperty({ name: 'page' })
  @Expose({ name: 'page' })
  @IsOptional()
  page?: number

  @ApiProperty({ name: 'limit' })
  @Expose({ name: 'limit' })
  @IsOptional()
  limit?: number

  @ApiProperty({ name: 'search_field' })
  @Expose({ name: 'search_field' })
  @IsOptional()
  searchField?: string

  @ApiProperty({ name: 'search_text' })
  @Expose({ name: 'search_text' })
  @IsOptional()
  searchText?: string

  @ApiProperty({ name: 'sort' })
  @Expose({ name: 'sort' })
  @IsOptional()
  sort?: string

  @ApiProperty({ name: 'sort_type' })
  @Expose({ name: 'sort_type' })
  @IsOptional()
  sortType?: 'ASC' | 'DESC'

  @ApiProperty({ name: 'type' })
  @Expose({ name: 'type' })
  @IsOptional()
  type?: number
}

export class CreateReasonCategoryDto {
  @ApiProperty({ name: 'name' })
  @Expose({ name: 'name' })
  name: JsonNameInterface

  @ApiProperty({ name: 'type' })
  @Expose({ name: 'type' })
  @IsEnum(ReasonCategoryTypeEnum)
  type: number
}

export class UpdateReasonCategoryDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  @IsString()
  id: string

  @ApiProperty({ name: 'name' })
  @Expose({ name: 'name' })
  name: JsonNameInterface

  @ApiProperty({ name: 'type' })
  @Expose({ name: 'type' })
  @IsEnum(ReasonCategoryTypeEnum)
  type: ReasonCategoryTypeEnum
}

export class ReasonCategoryDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string

  @ApiProperty({ name: 'name' })
  @Expose({ name: 'name' })
  name: JsonNameInterface

  @ApiProperty({ name: 'type' })
  @Expose({ name: 'type' })
  type: number

  @ApiProperty({ name: 'reasons' })
  @Expose({ name: 'reasons' })
  @Type(() => ReasonDto)
  reasons?: ReasonDto[]
}
