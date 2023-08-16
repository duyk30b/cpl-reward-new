import { Exclude, Expose } from 'class-transformer'

export const BOT_TYPE = {
  2: 'Bot_A',
  3: 'Bot_P',
  4: 'Getekeeper',
  5: 'Bot_MM',
}

export const BOT_STATUS = {
  1: 'Active',
  2: 'Inactive',
}

export enum BOT_TYPE_ENUM {
  BOT_A = 2,
  BOT_P = 3,
  GATEKEEPER = 4,
  BOT_MM = 5,
}

export enum BOT_STATUS_ENUM {
  ACTIVE = 1,
  IN_ACTIVE = 2,
}

export class PostUserDto {
  success: boolean
  message?: string
  data?: string
  errorCode?: number
}

export class BotParams {
  @Expose({ name: 'per_page' })
  size?: number = 25

  @Expose({ name: 'page' })
  page?: number = 0

  @Expose({ name: 'user_id' })
  user_id?: string

  @Expose({ name: 'search_text' })
  email?: string

  @Expose({ name: 'user_type' })
  user_type?: string
}

@Exclude()
export class ConfigureSetting {
  @Expose()
  extend_orders = 30

  @Expose()
  expire_time = '10000' // milliseconds
}

@Exclude()
export class BotSettingItem {
  @Expose()
  user_id: string

  @Expose()
  email: string

  @Expose()
  user_type = BOT_TYPE_ENUM.BOT_A

  @Expose()
  status? = BOT_STATUS_ENUM.IN_ACTIVE

  @Expose()
  configure = new ConfigureSetting()
}
