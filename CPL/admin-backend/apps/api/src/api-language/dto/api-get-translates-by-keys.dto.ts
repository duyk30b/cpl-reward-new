import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ApiGetTranslatesByKeysDto {
  @ApiProperty({ required: true, type: [String] })
  @Expose()
  @IsNotEmpty()
  keys: string[] = []
}
