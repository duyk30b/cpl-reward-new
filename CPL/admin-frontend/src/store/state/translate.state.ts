import { LanguageItemDto } from '@/models/setting-exchange/Language'

export class BaseState {
  loading: boolean
  error?: Record<string, any> | Array<Record<string, any>>
}

export class CategoryTranslateState extends BaseState {
  translates: LanguageItemDto[]
}

export class LanguageState extends BaseState {
  translates: LanguageItemDto[]
}
