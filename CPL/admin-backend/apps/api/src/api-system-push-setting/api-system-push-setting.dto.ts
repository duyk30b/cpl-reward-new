import { MultiLanguageFieldDto } from '@lib/grpc-client/grpc-client.dto'
import { TransformBoolean } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class SystemPushSettingFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ required: false, example: 20 })
  @Expose()
  limit: number

  @ApiProperty({ required: false })
  @Expose()
  type: string

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ required: false })
  @Expose()
  lang: string

  @ApiProperty({ name: 'is_active', required: false })
  @Expose({ name: 'is_active' })
  @TransformBoolean()
  isActive: boolean

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export class UpdateSystemPushNotificationSettingDto {
  @ApiProperty()
  @Expose()
  @Type(() => MultiLanguageFieldDto)
  @ValidateNested()
  title: MultiLanguageFieldDto

  @ApiProperty()
  @Expose()
  @Type(() => MultiLanguageFieldDto)
  @ValidateNested()
  content: MultiLanguageFieldDto

  @ApiProperty({ name: 'is_active' })
  @Expose({ name: 'is_active' })
  @IsNotEmpty()
  isActive: boolean
}

export class ToggleActiveDto {
  @ApiProperty({ name: 'is_active' })
  @Expose({ name: 'is_active' })
  @IsNotEmpty()
  isActive: boolean
}
