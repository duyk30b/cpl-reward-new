import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class ApiSetTranslateDto {
  @ApiProperty({ required: true })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  key: string

  @ApiProperty({
    required: true,
    example: { en: 'Unknown Error.', ja: '未知のエラー。' },
  })
  @Expose()
  @IsNotEmpty()
  translates: Record<string, string>
}
