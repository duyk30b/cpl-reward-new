import {
  Exclude,
  Expose,
  instanceToInstance,
  Transform,
  Type,
} from 'class-transformer'
import { IsEnum, IsInstance, IsOptional } from 'class-validator'
import { BOT_STATUS, BOT_TYPE } from './obm-bot-id.enum'

export class bodyGeneric<T> {
  @Expose()
  name: string

  @Expose()
  data: T
}

@Exclude()
export class BotSettingParams {
  @Expose()
  user_id?: string

  @Expose()
  email?: string

  @Expose()
  @IsOptional()
  user_type?: BOT_TYPE

  @Expose()
  @Transform(({ value }) => {
    return value > 0 ? Number(value) - 1 : 0
  })
  page? = 0

  @Expose()
  size? = 25
}

@Exclude()
export class ConfigureSetting {
  @Expose()
  extend_orders: number

  @Expose()
  expire_time: string // milliseconds
}

@Exclude()
export class BotSettingItem {
  @Expose()
  user_id: string

  @Expose()
  email: string

  @Expose()
  @IsEnum(BOT_TYPE)
  user_type: BOT_TYPE

  @Expose()
  @IsOptional()
  created_at? = new Date().getTime()

  @Expose()
  @IsOptional()
  updated_at? = new Date().getTime()

  @Expose()
  @IsEnum(BOT_STATUS)
  status? = BOT_STATUS.IN_ACTIVE

  @Expose()
  @IsInstance(ConfigureSetting)
  @Type(() => ConfigureSetting)
  @Transform(
    ({ value }) =>
      instanceToInstance(value, {
        exposeDefaultValues: true,
      }) || new ConfigureSetting(),
  )
  configure?: ConfigureSetting
}

@Exclude()
export class BotSettingListResponse {
  @Expose()
  page: number

  @Expose()
  size: number

  @Expose()
  total: number

  @Expose()
  contents: BotSettingItem[]
}

@Exclude()
export class Pagination {
  @Expose()
  @Transform(({ value }) => {
    return Number(value) + 1
  })
  page: number

  @Expose()
  size: number

  @Expose()
  total: number
}

@Exclude()
export class BotSettingPagination {
  @Expose()
  pagination: Pagination

  @Expose()
  data: BotSettingItem[]
}
