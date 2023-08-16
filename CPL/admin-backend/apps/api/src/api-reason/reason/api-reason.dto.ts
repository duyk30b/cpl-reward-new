import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { JsonNameInterface } from '@lib/grpc-client/reason/interfaces/json-name.interface'
import { IPaginationMeta } from '@lib/grpc-client'

export class ReasonFilterDto {
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
  @IsString()
  searchField?: string

  @ApiProperty({ name: 'search_text' })
  @Expose({ name: 'search_text' })
  @IsOptional()
  @IsString()
  searchText?: string

  @ApiProperty({ name: 'sort' })
  @Expose({ name: 'sort' })
  @IsOptional()
  @IsString()
  sort?: string

  @ApiProperty({ name: 'sort_type' })
  @Expose({ name: 'sort_type' })
  @IsOptional()
  @IsString()
  sortType?: 'ASC' | 'DESC'

  @ApiProperty({ name: 'category_id' })
  @Expose({ name: 'category_id' })
  @IsOptional()
  categoryId?: string
}

export class CreateReasonDto {
  @ApiProperty({ name: 'name' })
  @Expose({ name: 'name' })
  name: JsonNameInterface

  @ApiProperty({ name: 'category_id' })
  @Expose({ name: 'category_id' })
  categoryId: string
}

export class ReasonDto {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  id: string

  @ApiProperty({ name: 'name' })
  @Expose({ name: 'name' })
  name: JsonNameInterface

  @ApiProperty({ name: 'category_id' })
  @Expose({ name: 'category_id' })
  categoryId: string
}

export class ReasonListDto {
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: ReasonDto[]

  @ApiProperty({ name: 'pagination' })
  @Expose({ name: 'pagination' })
  pagination: IPaginationMeta
}
