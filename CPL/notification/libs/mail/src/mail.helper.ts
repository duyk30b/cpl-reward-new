import { DEFAULT_LANG, isSupportedLang } from '@libs/common'
import { join } from 'path'
import * as pug from 'pug'

export function renderTemplate(
  template: string,
  variables,
  lang: string = DEFAULT_LANG,
) {
  if (!isSupportedLang(lang)) lang = DEFAULT_LANG
  const compiledFunction = pug.compileFile(
    join(__dirname, 'templates', lang, `${template}.pug`),
  )
  return compiledFunction(variables)
}
