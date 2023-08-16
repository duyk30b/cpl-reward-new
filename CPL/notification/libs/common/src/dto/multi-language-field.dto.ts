import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class MultiLanguageFieldDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  en: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  ja: string
}
