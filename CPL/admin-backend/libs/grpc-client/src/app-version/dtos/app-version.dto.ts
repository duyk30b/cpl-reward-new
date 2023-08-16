import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator'
import { AppPlatform } from '../enums'

export class GetAppVersionRequestDto {
  @Expose()
  @IsEnum(AppPlatform)
  @ApiProperty({ enum: AppPlatform })
  platform: string
}

export class AppVersionsResponse {
  @Expose()
  @Type(() => AppVersion)
  @ValidateNested({ each: true })
  data: AppVersion[]
}

export class AppVersion {
  @Expose()
  @IsEnum(AppPlatform)
  @ApiProperty({ enum: AppPlatform })
  platform: string

  @Expose()
  @Matches('^([0-9]+).([0-9]+).([0-9]+)$')
  @IsString()
  @ApiProperty()
  version: string

  @Expose({ name: 'change_log', toPlainOnly: true })
  @IsString()
  @ApiProperty({ name: 'change_log' })
  changeLog: string

  @Expose({ name: 'release_date', toPlainOnly: true })
  @IsDateString()
  @ApiProperty({ name: 'release_date' })
  releaseDate: string

  @Expose({ name: 'force_update', toPlainOnly: true })
  @ApiProperty({ name: 'force_update' })
  @IsBoolean()
  @Transform((item) => item.value || false)
  forceUpdate: boolean
}
