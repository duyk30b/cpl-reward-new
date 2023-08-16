import { Expose } from 'class-transformer'

export class LoginDto {
  @Expose()
  phone: string

  @Expose()
  phoneCountry: string

  @Expose()
  email: string

  @Expose()
  password: string
}
