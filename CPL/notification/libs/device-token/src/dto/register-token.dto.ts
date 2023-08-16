import { Expose } from 'class-transformer'

export class RegisterTokenDto {
  @Expose()
  userId: string

  @Expose()
  deviceId: string

  @Expose()
  token: string
}
