import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateDeviceMapDto {
  @Expose()
  @IsNotEmpty()
  userId: string

  @Expose()
  @IsNotEmpty()
  deviceId: string

  @Expose()
  lastLogin: number

  @Expose()
  lastIp: string
}
