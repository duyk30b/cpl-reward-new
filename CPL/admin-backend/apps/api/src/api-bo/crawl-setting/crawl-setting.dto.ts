import { filterBaseDTO } from './../api-bo.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class filterPairDTO extends filterBaseDTO {
  @ApiProperty({ name: 'get_only', required: false, enum: ['true', 'false'] })
  @Expose({ name: 'get_only' })
  getOnly: 'true' | 'false'
}

export class filterModeDTO extends filterBaseDTO {
  @ApiProperty({ name: 'get_only', required: false, enum: ['true', 'false'] })
  @Expose({ name: 'get_only' })
  getOnly: 'true' | 'false'
}

//BO Crawl Setting
export class ApiCreateBOCrawlSettingDTO {
  @ApiProperty({ required: false, name: 'setting_key' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  settingKey: string

  @ApiProperty({ required: false, name: 'setting_value' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  settingValue: string

  @ApiProperty({ required: false, name: 'active' })
  @Expose()
  @IsNotEmpty()
  active: number
}

export class ApiUpdateBOCrawlSettingDTO {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty({ required: false, name: 'setting_key' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  settingKey: string

  @ApiProperty({ required: false, name: 'setting_value' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  settingValue: string

  @ApiProperty({ required: false, name: 'active' })
  @Expose()
  @IsNotEmpty()
  active: number
}

export class ApiDeleteBOCrawlSettingDTO {
  @ApiProperty()
  @Expose()
  id: number
}
