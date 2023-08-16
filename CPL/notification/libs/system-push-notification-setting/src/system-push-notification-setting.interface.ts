import { MultiLanguageFieldDto } from '@libs/common/dto/multi-language-field.dto'
import { IBaseFilter } from '@libs/util/interfaces/common.interface'

export interface ISystemPushNotificationSettingFilter extends IBaseFilter {
  lang?: string
  isActive?: number
  type?: string
}

export interface IUpdateSystemPushNotificationSettingDto {
  id: string
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  isActive: boolean
}

export interface IToggleActiveDto {
  id: string
  isActive: boolean
}
