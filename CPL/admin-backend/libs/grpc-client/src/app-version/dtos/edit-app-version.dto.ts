import { AppVersion } from './app-version.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsString,
  Matches,
} from 'class-validator'
import { AppPlatform } from '../enums'

export class CreateAppVersionDto implements AppVersion {
  @Expose()
  @IsEnum(AppPlatform)
  @ApiProperty({ enum: AppPlatform })
  platform: string

  @Expose()
  @Matches('^([0-9]+).([0-9]+).([0-9]+)$')
  @IsString()
  @ApiProperty()
  version: string

  @Expose({ name: 'change_log' })
  @IsString()
  @ApiProperty({ name: 'change_log' })
  changeLog: string

  @Expose({ name: 'release_date' })
  @IsDateString()
  @ApiProperty({ name: 'release_date' })
  releaseDate: string

  @Expose({ name: 'force_update' })
  @ApiProperty({ name: 'force_update' })
  @IsBoolean()
  @Transform((item) => item.value || false)
  forceUpdate: boolean
}

export class EditAppVersionDto extends CreateAppVersionDto {}

export class DeleteAppVersionDto extends CreateAppVersionDto {}
