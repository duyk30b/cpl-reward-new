import { Expose, Type } from 'class-transformer'
import { MultiLanguageFieldDto } from '../grpc-client.dto'

export class SystemPushNotificationSettingDto {
  @Expose()
  id: string

  @Expose()
  type: string

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  title: MultiLanguageFieldDto

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  content: MultiLanguageFieldDto

  @Expose({ name: 'is_active' })
  isActive: boolean
}
