import { IsNotEmpty } from 'class-validator'

export class CreateDeviceDto {
  @IsNotEmpty()
  deviceHash: string

  @IsNotEmpty()
  deviceInfo: string
}
