import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class PlatformDto {
  @Expose()
  value: string
}

export class DeviceInfoDto {
  @Expose()
  visitorId: string

  @Expose()
  @ValidateNested()
  @Type(() => PlatformDto)
  platform: PlatformDto

  @Expose()
  browserName: string

  @Expose()
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
