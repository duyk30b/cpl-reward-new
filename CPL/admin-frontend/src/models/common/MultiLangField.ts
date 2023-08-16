import { Expose } from 'class-transformer'

export class MultiLanguageField {
  @Expose()
  en: string

  @Expose()
  ja: string

  @Expose({ name: 'zh_cn' })
  zhCn: string
}
