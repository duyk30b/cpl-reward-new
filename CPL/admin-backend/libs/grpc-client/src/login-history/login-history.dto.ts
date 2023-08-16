import { Expose } from 'class-transformer'

export class LoginHistoryListDto {
  @Expose()
  email: string

  @Expose({ name: 'created_at' })
  createdAt: string

  @Expose()
  ip: string

  @Expose()
  browser: string

  @Expose()
  os: string
}
