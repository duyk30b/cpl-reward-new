import { FileType } from '../formatter/file-type.enum'
import * as https from 'https'
import { DeviceInfo } from '@lib/device'
import * as dayjs from 'dayjs'
import { Pagination } from 'nestjs-typeorm-paginate'
import { isArray } from 'class-validator'
import btoa = require('btoa')
import atob = require('atob')
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { KycIdDocumentMetadata } from '@lib/user-kyc/enum/user-kyc.enum'
import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { RequestOptions } from 'https'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'
import * as fs from 'fs'
dayjs.extend(utc)
dayjs.extend(timezone)

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

export function getUserLogoutKey(userId: string, deviceId: string) {
  return `logout:${userId}:${deviceId}`
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

export function parseDeviceInfo(deviceInfo: string): DeviceInfo {
  return JSON.parse(Buffer.from(deviceInfo, 'base64').toString())
}

export function getBrowserFromDeviceInfo(deviceInfo: DeviceInfo) {
  return deviceInfo.browserName
    ? `${deviceInfo.browserName} ${deviceInfo.browserVersion}`
    : 'Unknown'
}

export function getOSFromDeviceInfo(deviceInfo: DeviceInfo) {
  return deviceInfo?.platform?.value || 'Unknown'
}

export function getDeviceHashFromDeviceInfo(deviceInfo: DeviceInfo) {
  return deviceInfo?.visitorId || ''
}

export function isImage(mimetype: string) {
  return ([FileType.JPG, FileType.PNG] as string[]).includes(
    mimetype.toLowerCase(),
  )
}

export function getFrontDocumentFile(userKyc: UserKyc) {
  const files = userKyc.files
  return files.find((file) => {
    return (
      [
        KycIdDocumentMetadata.PASSPORT,
        KycIdDocumentMetadata.ID_CARD_FRONT,
        KycIdDocumentMetadata.DRIVING_LICENCE_FRONT,
        KycIdDocumentMetadata.RESIDENCE_CARD_FRONT,
        KycIdDocumentMetadata.NUMBER_CARD_FRONT,
      ] as string[]
    ).includes(file.metadata)
  })
}

export function getFaceFile(userKyc: UserKyc | UserKycHistory) {
  const files = userKyc.files
  return files.find(
    (file) =>
      file.metadata == KycIdDocumentMetadata.SELFIE ||
      file.metadata == KycIdDocumentMetadata.FACE_RECOGNITION,
  )
}

export function getBufferFromUrl(
  url: string,
  options?: RequestOptions,
): Promise<Buffer> {
  return new Promise((resolve) => {
    https.get(url, options, (response) => {
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

export function timestampToDate(
  timestamp: number,
  format = 'YYYY-MM-DD HH:mm:ss',
) {
  return dayjs(timestamp).format(format)
}

export function currentTimestamp() {
  return new Date().getTime()
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
export function convertStringToUnicode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

export function convertUnicodeToString(uni: string): string {
  return decodeURIComponent(escape(atob(uni)))
}

export function diffTwoArray(fisrt: any[], second: any[]): any[] {
  if (isArray(fisrt) && isArray(second)) {
    return fisrt.filter((item) => second.indexOf(item) === -1)
  }
  return []
}

export function uniqueArray(arr: any[]): any[] {
  const unique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index
  }
  return arr.filter(unique)
}

export function convertFromTwoToOneDimensionalArray(arr: any[]): any[] {
  return arr.reduce((prev, next) => {
    return prev.concat(next)
  })
}

export function compareCaseInsensitive(str1: string, str2: string) {
  if (!str1 && !str2) return true
  if (!str1 || !str2) return false
  return str1.toLowerCase() == str2.toLowerCase()
}

export function formatEmail(email: string, ignoreDomains: string[]) {
  if (!email) return null
  const [mail, domain] = email.split('@')
  if (!mail) return null
  if (ignoreDomains && ignoreDomains.includes(domain)) return email
  return `${mail.replace(/\./g, '').replace(/\+.*?$/g, '')}@${domain || ''}`
}

export function formatInfoToDelete(info: string) {
  if (!info) return info
  return `${info}_deleted_${new Date().getTime()}_${randomString(3)}`
}

export function touchFile(filePath: string) {
  const time = new Date()
  try {
    fs.utimesSync(filePath, time, time)
  } catch (err) {
    fs.closeSync(fs.openSync(filePath, 'w'))
  }
}

export async function limitTimePromise<T>(
  promise: Promise<T>,
  timeInMs: number,
  timeoutResult: T,
): Promise<T> {
  const timeoutPromise = new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(timeoutResult)
    }, timeInMs)
  })
  return await Promise.race([promise, timeoutPromise])
}
