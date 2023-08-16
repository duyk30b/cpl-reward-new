import { Expose } from 'class-transformer'

export class GrpcBaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class FormatCrawSettingGrpc {
  settingKey: string
  settingValue: any

  constructor(param: any = {}) {
    this.settingKey = param.settingKey ? param.settingKey : ''
    this.settingValue = param.settingValue ? JSON.parse(param.settingValue) : ''
  }
}

export class GrpcBOCrawlSettingDTO {
  @Expose()
  id: number

  @Expose({ name: 'setting_key' })
  settingKey: string

  @Expose({ name: 'setting_value' })
  settingValue: string

  @Expose({ name: 'active' })
  active: number
}

export class GrpcBOCrawlSettingResponseDTO extends GrpcBaseResponseDTO {
  data?: GrpcBOCrawlSettingDTO
}
