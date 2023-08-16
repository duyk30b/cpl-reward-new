import { Expose, Type } from 'class-transformer'
import { MultiLanguageField } from '../common/MultiLangField'

export class SystemPushNotificationSetting {
  @Expose()
  id: string

  @Expose()
  type: string

  @Expose()
  @Type(() => MultiLanguageField)
  title: MultiLanguageField

  @Expose()
  @Type(() => MultiLanguageField)
  content: MultiLanguageField

  @Expose({ name: 'is_active' })
  isActive: boolean
}

export class UpdateSystemPushSettingRequest {
  @Expose()
  @Type(() => MultiLanguageField)
  title: MultiLanguageField

  @Expose()
  @Type(() => MultiLanguageField)
  content: MultiLanguageField

  @Expose({ name: 'is_active' })
  isActive: boolean
}
