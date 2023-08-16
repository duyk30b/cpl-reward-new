import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class ApiPreviewTranslateDto {
  @ApiProperty({ required: true })
  @Expose()
  @IsNotEmpty()
  @IsString()
  key: string
}

export class ApiApplyAllDto extends ApiPreviewTranslateDto {}
