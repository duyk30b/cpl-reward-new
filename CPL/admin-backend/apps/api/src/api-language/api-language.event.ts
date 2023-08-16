import { TranslateAdminSettingDto } from '@lib/grpc-client/common-setting/language-setting/language-setting.dto'

export class TranslateApplyAllEvent {
  excelKey: string
  upsertData: TranslateAdminSettingDto[]
}
