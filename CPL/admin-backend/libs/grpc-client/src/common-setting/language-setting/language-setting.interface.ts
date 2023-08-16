import { Observable } from 'rxjs'
import {
  LanguagesByTypeResponse,
  AdminTranslateByKeysRequest,
  AdminTranslateByKeysResponse,
  GetTranslatesResponse,
  IGetLanguagesSettingDto,
  IGetTranslateSettingDto,
  LanguagePack,
  LanguageSettingDto,
  LanguagesSettingResponse,
  TranslateAdminSettingDto,
  TranslatesAdminSettingDto,
  IGetLanguagesByType,
  KeyNameLanguageCodeResponse,
} from './language-setting.dto'

export interface ILanguageSetting {
  getLanguagePack: (request: { language: string }) => Observable<LanguagePack>
  getTranslates: (
    request: IGetTranslateSettingDto,
  ) => Observable<GetTranslatesResponse>
  setTranslate: (
    request: TranslateAdminSettingDto,
  ) => Observable<TranslateAdminSettingDto>
  setTranslates: (
    request: TranslatesAdminSettingDto,
  ) => Observable<TranslatesAdminSettingDto>
  getAdminTranslateByKeys: (
    request: AdminTranslateByKeysRequest,
  ) => Observable<AdminTranslateByKeysResponse>
  getAllAdminTranslates: ({}) => Observable<AdminTranslateByKeysResponse>
  getLanguagesSetting: (
    request: IGetLanguagesSettingDto,
  ) => Observable<LanguagesSettingResponse>
  setLanguageSetting: (
    request: LanguageSettingDto,
  ) => Observable<LanguageSettingDto>
  getLanguagesByType: (
    request: IGetLanguagesByType,
  ) => Observable<LanguagesByTypeResponse>
  getKeyNameLanguageCode: ({}) => Observable<KeyNameLanguageCodeResponse>
  getPairCategoriesKey: ({}) => Observable<AdminTranslateByKeysResponse>
}
