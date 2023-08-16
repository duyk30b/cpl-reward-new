import { Expose, Type } from 'class-transformer'
export class GroupPairs {
  [key: string]: string[]
}

export class Pair {
  coin: string
  currency: string
  pair?: string
}

export class ModuleSetting {
  pairs: string[]
  swapCommon: any
}

export class SettingByModule {
  [key: string]: ModuleSetting
}
export class PaginationDto {
  @Expose()
  page: number

  @Expose()
  size: number

  @Expose()
  total: number
}

export class SwapSetting {
  @Expose()
  id: string

  @Expose({ name: 'module', toPlainOnly: true })
  module: string

  @Expose({ name: 'code', toPlainOnly: true })
  code: string

  @Expose({ name: 'value', toPlainOnly: true })
  value: string

  @Expose({ name: 'status', toPlainOnly: true })
  status: number | boolean

  @Expose({ name: 'created_at', toPlainOnly: true })
  created_at: string

  @Expose({ name: 'updated_at', toPlainOnly: true })
  updated_at: string
}

export class ListSwapSettingRequest {
  @Expose({ name: 'search_field' })
  search_field?: string

  @Expose({ name: 'search_text' })
  search_text?: string

  @Expose({ name: 'sort' })
  sort?: string

  @Expose({ name: 'sort_type' })
  sort_type?: string

  @Expose({ name: 'page' })
  page: number

  @Expose({ name: 'size' })
  size: number

  @Expose({ name: 'limit' })
  limit: number
}

export class SwapSettingResultDto {
  @Type(() => SwapSetting)
  @Expose({ name: 'data' })
  data: SwapSetting[] = []

  @Expose()
  pagination: PaginationDto
}

export class CreateSwapSettingRequest {
  @Expose({ name: 'module', toPlainOnly: true })
  module: string

  @Expose({ name: 'code', toPlainOnly: true })
  code: string

  @Expose({ name: 'value', toPlainOnly: true })
  value: string

  @Expose({ name: 'status', toPlainOnly: true })
  status: number | boolean
}

export class UpdateSwapSettingRequest {
  @Expose({ name: 'id', toPlainOnly: true })
  id: string

  @Expose({ name: 'module', toPlainOnly: true })
  module: string

  @Expose({ name: 'code', toPlainOnly: true })
  code: string

  @Expose({ name: 'value', toPlainOnly: true })
  value: string

  @Expose({ name: 'status', toPlainOnly: true })
  status: number | boolean
}
