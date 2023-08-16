import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsString } from 'class-validator'

export class LanguageDto {
  @ApiProperty({ name: 'language_key' })
  @Expose({ name: 'language_key' })
  @Type(() => String)
  @IsString()
  languageKey: string
}
