import * as https from 'https'
import * as dayjs from 'dayjs'
import { Pagination } from 'nestjs-typeorm-paginate'
import { INestApplicationContext } from '@nestjs/common'
import { NestContainer } from '@nestjs/core'

export function toSnakeCase(str: string): string {
  return (
    str[0].toLowerCase() +
    str.slice(1).replace(/[A-Z]/g, (char: string) => {
      return `_${char.toLowerCase()}`
    })
  )
}

export function getEnumNames(targetEnum): string[] {
  return Object.keys(targetEnum).filter((key) => isNaN(parseInt(key)))
}

export function getEnumValues(targetEnum): number[] {
  return Object.keys(targetEnum)
    .map((key) => parseInt(key))
    .filter((key) => !isNaN(key))
}

export function getEnumComment(targetEnum): string {
  return getEnumValues(targetEnum)
    .map((val) => `${val} - ${targetEnum[val]}`)
    .join(', ')
}

export function getUserLogoutKey(userId: string, deviceId: string) {
  return `logout-${userId}-${deviceId}`
}

export function randomString(
  length = 10,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
) {
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function stripNull(object) {
  if (
    !object ||
    typeof object !== 'object' ||
    Array.isArray(object) ||
    object instanceof Date
  ) {
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

export function currentTime(format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs().format(format)
}

export function currentTimestamp() {
  return new Date().getTime()
}

export function timeWithFormat(timestamp?: number, format?: string) {
  if (!timestamp) timestamp = currentTimestamp()
  if (!format) format = 'YYYY-MM-DD HH:mm:ss'
  return dayjs(timestamp).format(format)
}

export function escapeLikeChars(str: string) {
  return str.replace(/%/g, '\\%').replace(/_/g, '\\_')
}

export function arrayUnique(arr: any[]) {
  return [...new Set(arr)]
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

export function getAllControllers(app: INestApplicationContext) {
  const container = (app as any).container as NestContainer
  const modules = container.getModules()
  const result = []
  modules.forEach((module) => {
    const controllers = module.controllers
    controllers.forEach((controller, type) => {
      result.push(type)
    })
  })
  return result
}
