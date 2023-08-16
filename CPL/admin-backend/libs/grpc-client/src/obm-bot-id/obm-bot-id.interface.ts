import { Observable } from 'rxjs'
import { BotSettingItem, BotSettingParams } from './obm-bot-id.dto'

export interface IGrpcObmBotService {
  getSettingsAdmin(query: BotSettingParams): Observable<OBMBotResponse>
  updateBotId(body: BotSettingItem): Observable<string>
}

export interface OBMBotConfigure {
  extend_orders: number
  expire_time: string
}

export interface OBMBotItem {
  user_id: string
  email: string
  user_type: number
  status: number
  created_at: number
  updated_at: number
  configure: OBMBotConfigure
}

export interface OBMBotParams {
  user_id: string
  email: string
  user_type: number
  page: number
  size: number
}

export interface OBMBotResponse {
  contents: OBMBotItem[]
  page: number
  size: number
  total: number
}
