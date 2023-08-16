import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator'

export class ApiSetLanguageDto {
  @ApiProperty({ required: true, name: 'language_code' })
  @Expose({ name: 'language_code' })
  @IsNotEmpty()
  @Length(0, 255)
  languageCode: string

  @ApiProperty({ required: false, name: 'is_active' })
  @Expose({ name: 'is_active' })
  @IsBoolean()
  @IsOptional()
  isActive: boolean

  @ApiProperty({ required: false, name: 'language_name' })
  @Expose({ name: 'language_name' })
  @IsNotEmpty()
  @Length(0, 255)
  languageName: string
}
