import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'

export class PlatformDto {
  @Expose()
  @IsNotEmpty()
  value: string
}

export class DeviceInfoDto {
  @Expose()
  @IsNotEmpty()
  visitorId: string

  @Expose()
  @ValidateNested()
  @Type(() => PlatformDto)
  platform: PlatformDto

  @Expose()
  @IsOptional()
  browserName: string

  @Expose()
  @IsOptional()
  browserVersion: string
}

export class DeviceDto {
  @Expose()
  @IsNotEmpty()
  id: number

  @Expose({ name: 'device_hash' })
  @IsNotEmpty()
  deviceHash: string

  @Expose({ name: 'device_info' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo: DeviceInfoDto
}
