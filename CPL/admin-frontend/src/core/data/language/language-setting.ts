import { Expose } from 'class-transformer'

export class LanguageSetting {
  @Expose()
  language_code: string

  @Expose()
  icon: string

  @Expose()
  name: string

  @Expose()
  last_update_time?: string

  @Expose()
  default_language?: boolean

  @Expose()
  is_active?: boolean
}
