import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import {
  BasePaginationQueryDto,
  BasePaginationDto,
} from '@app/common/base-pagination.dto'

export class TranslateAdminSettingDto {
  @ApiProperty({ type: String })
  @Expose()
  key: string

  @Expose()
  @ApiProperty({
    example: {
      en: 'Email Verification Code',
      jp: 'メール認証コード',
    },
  })
  translates: Record<string, string>
}

export class TranslatesAdminSettingDto {
  @Expose()
  @Type(() => TranslateAdminSettingDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [TranslateAdminSettingDto] })
  data: TranslateAdminSettingDto[]
}

export class GetTranslatesResponse extends BasePaginationDto<
  TranslateAdminSettingDto[]
> {
  @ApiProperty({ name: 'data', type: [TranslateAdminSettingDto] })
  @Type(() => TranslateAdminSettingDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: TranslateAdminSettingDto[] = []
}

export class ApiGetTranslatesResponse extends BasePaginationDto<string[]> {
  @ApiProperty({
    name: 'data',
    type: [],
    example: [
      {
        key: 'COMMON.ERROR.UNKNOWN_ERROR',
        en: 'Unknown Error.',
        ja: '未知のエラー。',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: []
}

export class IGetTranslateSettingDto extends BasePaginationQueryDto {
  @IsString()
  @IsOptional()
  @Expose()
  key?: string
}
export class IGetLanguagesSettingDto extends IGetTranslateSettingDto {}

export class LanguagePack {
  @ApiProperty()
  language: string

  @ApiProperty()
  translates: Record<string, string>[]
}

export class AdminTranslateByKeysResponse {
  @ApiProperty({ name: 'data', type: [TranslateAdminSettingDto] })
  @Type(() => TranslateAdminSettingDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: TranslateAdminSettingDto[] = []
}

export class AdminTranslateByKeysRequest {
  @ApiProperty({ name: 'keys', type: [] })
  @Expose({ name: 'keys' })
  keys: string[] = []
}

export class LanguageSettingDto {
  @Expose({ name: 'language_code' })
  @ApiProperty({ name: 'language_code' })
  languageCode: string

  @Expose()
  @ApiProperty()
  icon: string

  @Expose()
  @ApiProperty()
  name: string

  @Expose({ name: 'last_update_time' })
  @ApiProperty({ name: 'last_update_time' })
  lastUpdateTime?: string

  @Expose({ name: 'default_language' })
  @ApiProperty({ name: 'default_language' })
  defaultLanguage?: boolean

  @Expose({ name: 'is_active' })
  @ApiProperty({ name: 'is_active' })
  isActive?: boolean
}

export class LanguagesSettingResponse extends BasePaginationDto<
  LanguageSettingDto[]
> {
  @ApiProperty({ name: 'data', type: [LanguageSettingDto] })
  @Type(() => LanguageSettingDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: LanguageSettingDto[] = []
}

export class CodeLanguagesResponse {
  @ApiProperty({ name: 'data', type: [] })
  @Expose({ name: 'data' })
  data: string[] = []
}

export class LanguagesByTypeResponse {
  @ApiProperty({ name: 'data', type: [LanguageSettingDto] })
  @Expose({ name: 'data' })
  @Type(() => LanguageSettingDto)
  @ValidateNested({ each: true })
  data: LanguageSettingDto[] = []
}

export class IGetLanguagesByType {
  @ApiProperty({ name: 'type', type: String })
  @Expose({ name: 'type' })
  type: string
}

export class KeyNameLanguageCodeResponse {
  @ApiProperty()
  data: Record<string, string>
}
