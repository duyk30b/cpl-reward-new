import { createI18n } from 'vue-i18n'
import { messagesEn } from './i18n.en'
import { messagesJp } from './i18n.jp'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  globalInjection: true,
  messages: {
    en: messagesEn,
    ja: messagesJp,
  },
})

export default i18n
