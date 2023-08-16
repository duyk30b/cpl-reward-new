import * as https from 'https'
import * as dayjs from 'dayjs'
import { MultiLanguageFieldDto } from '@libs/common/dto/multi-language-field.dto'
import { DEFAULT_LANG } from '@libs/common'
import { Pagination } from 'nestjs-typeorm-paginate'

export function toSnakeCase(str: string): string {
  return (
    str[0].toLowerCase() +
    str.slice(1).replace(/[A-Z]/g, (char: string) => {
      return `_${char.toLowerCase()}`
    })
  )
}

export function isStringEnum(targetEnum) {
  return Object.entries(targetEnum).some(
    ([key, value]) => isNaN(parseInt(key)) && isNaN(parseInt(value as string)),
  )
}

export function getEnumNames(targetEnum): string[] {
  return isStringEnum(targetEnum)
    ? Object.keys(targetEnum)
    : Object.keys(targetEnum).filter((key) => isNaN(parseInt(key)))
}

export function getEnumValues(targetEnum) {
  return isStringEnum(targetEnum)
    ? Object.values(targetEnum)
    : Object.keys(targetEnum)
        .map((key) => parseInt(key))
        .filter((key) => !isNaN(key))
}

export function getEnumComment(targetEnum): string {
  return getEnumValues(targetEnum)
    .map((val) => `${val} - ${targetEnum[val as string]}`)
    .join(', ')
}

export function randomString(
  length = 10,
  options: {
    excludeNumber?
  } = {},
) {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  if (!options.excludeNumber) characters += '0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function stripNull(object) {
  if (!object || typeof object !== 'object' || object instanceof Date) {
    return object
  }
  Object.entries(object).forEach(([key, value]) => {
    if (value == null) delete object[key]
    else object[key] = stripNull(value)
  })
  return object
}

export function getBufferFromUrl(url: string): Promise<Buffer> {
  return new Promise((resolve) => {
    https.get(url, (response) => {
      const body: Buffer[] = []
      response
        .on('data', (chunk: Buffer) => {
          body.push(chunk)
        })
        .on('end', () => {
          resolve(Buffer.concat(body))
        })
    })
  })
}

export function currentTimestamp() {
  return new Date().getTime()
}

export function timeWithFormat(timestamp?: number, format?: string) {
  if (!timestamp) timestamp = currentTimestamp()
  if (!format) format = 'YYYY-MM-DD HH:mm:ss'
  return dayjs(timestamp).format(format)
}

export function fillDataByLang(
  langsMap: MultiLanguageFieldDto,
  lang: string,
  variables?: Record<string, string>,
) {
  let text = langsMap[lang] || langsMap[DEFAULT_LANG] || ''
  if (!text || !variables) return text
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`\\\{\\\s*${key}\\\s*\\\}`, 'g')
    text = text.replace(regex, variables[key])
  })
  return text
}

export function escapeLikeChars(str: string) {
  return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
}

export async function formatPaginate<T>(
  paginateFunction: Promise<Pagination<T>>,
) {
  const result = await paginateFunction
  return {
    data: result.items,
    pagination: {
      page: result.meta.currentPage,
      size: result.meta.itemsPerPage,
      total: result.meta.totalItems,
    },
  }
}

export function absNumberString(numberString: string) {
  return numberString.replace(/^\s*-\s*/, '')
}

export function slugify(str: string, maxLength = 255): string {
  return (str || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .slice(0, maxLength)
}
