import { IndexFacesResponse } from '@/models/common/AmazonRekognition'
import { KycStatus } from '@/models/user/UserKyc'
import { IGNORED_FACE_COLOR } from '@/models/user/UserKycScanData'
import store from '@/store'
import { Mutations } from '@/store/enums/StoreEnums'
import BigNumber from 'bignumber.js'
import { FixedNumber } from 'ethers'
import _ from 'lodash'
import moment from 'moment'
import i18n from '../plugins/i18n'
import { HttpStatus } from '../variables/common.enum'
const { t, te } = i18n.global

export function formatFieldByLocale(item, field) {
  const locale = i18n.global.locale.value
  const key = `${field}${locale.charAt(0).toUpperCase()}${locale.slice(1)}`
  return item[key] || item[field]
}

export function downloadFile(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.download = filename
  link.click()
}

export function downloadFileWithoutPopUp(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

export function parseAccountLevelStatus(accountLv: number, kycStatus: number) {
  if (accountLv == 3) {
    let lvStatus = 2
    if (kycStatus == KycStatus.NEW) lvStatus = 1
    else if (kycStatus == KycStatus.REJECT) lvStatus = 3
    return te(`levelStatusValue.${accountLv}.${lvStatus}`)
      ? t(`levelStatusValue.${accountLv}.${lvStatus}`)
      : t('unknown')
  }

  return te(`levelStatusValue.${accountLv}`)
    ? t(`levelStatusValue.${accountLv}`)
    : t('unknown')
}

export function formatDate(date, outputFormat = 'YYYY-MM-DD') {
  if (!date) return null
  return moment(date).format(outputFormat)
}

export function formatUTCDate(date, outputFormat = 'YYYY-MM-DD') {
  if (!date) return null
  return moment(date).utc().format(outputFormat)
}

export function convertDateFormat(
  date,
  inputFormat,
  outputFormat = 'DD/MM/YYYY HH:mm',
) {
  if (!date) return ''
  return moment(date, inputFormat).format(outputFormat)
}

export function stringToDate(str, inputFormat) {
  if (!str) return ''
  return moment(str, inputFormat).toDate()
}

export function convertTimestampToDate(
  milliseconds: string,
  format = 'DD/MM/YYYY HH:mm',
) {
  return convertDateFormat(milliseconds, 'x', format)
}

export function setPageFliud() {
  store.commit(Mutations.OVERRIDE_PAGE_LAYOUT_CONFIG, {
    content: { width: 'fluid' },
  })
}

export function buildLocalDatatableResponse(
  items: Array<any>,
  page: number,
  perPage: number,
) {
  const start = (page - 1) * perPage
  const end = start + perPage - 1
  const result = items.slice(start, end)
  return {
    status: HttpStatus.OK,
    data: {
      data: result,
      pagination: {
        page: page,
        size: perPage,
        total: items.length,
      },
    },
  }
}

export function fixedNumber(num, decimal = 0) {
  return parseFloat(num || 0).toFixed(decimal)
}

export function escapeHtml(str: string) {
  if (!str) return ''
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function getAllCountries() {
  return store.getters.masterdata?.countries || []
}

export function getCountryName(countryId: number) {
  const listOfCountries = getAllCountries()
  return listOfCountries.find((country) => country.id == countryId)?.name
}

export function trimEndSmallDecimal(number: string) {
  return FixedNumber.from(number || '0', 'fixed256x26')._value.replace(
    /\.0$/,
    '',
  )
}

export function retryErrorMessage(errors: Array<any>): string {
  if (errors.length === 0) {
    return ''
  }

  return String(errors[0].msg)
}

export function clone(obj) {
  return _.cloneDeep(obj)
}

export function checkPermission(permission: number) {
  const user = store.getters.currentUser
  if (user.is_root) return true

  const permissions = user.permissions
  if (!permissions?.length) return false
  return permissions.includes(permission)
}

export function checkScreen(screen: number) {
  const user = store.getters.currentUser
  if (user.is_root) return true

  const userScreens = user.screens ?? []
  if (!userScreens?.length) return false
  return userScreens.includes(screen)
}

export function hasAllPermissions(permissions: number[]) {
  return permissions.every((permission) => checkPermission(permission))
}

export function arrayUnique(arr: any[]) {
  return arr.filter((val, index) => arr.indexOf(val) == index)
}

export function getSubErrorCode(res) {
  return res?.status_code
}

export function formatServerErrors(
  errors: { property: string; msg: string }[],
) {
  if (!errors) return {}
  return errors.reduce((result, { property, msg }) => {
    result[property] = msg
    return result
  }, {})
}

export function formatCurrencyBalance(amount, zeroValue = 0) {
  const numberOfDecimalDigits = 10
  if (_.isNil(zeroValue)) {
    zeroValue = 0
  }

  const rawValue = new BigNumber(`${amount}`).toFixed(
    numberOfDecimalDigits,
    BigNumber.ROUND_DOWN,
  )
  return parseFloat(amount) && parseFloat(amount) !== Infinity && !isNaN(amount)
    ? new BigNumber(rawValue).toFormat()
    : zeroValue
}

export function getIndexFaceBoundingBoxs(response: IndexFacesResponse) {
  const indexed = (response?.FaceRecords || []).map(
    (face) => face.Face?.BoundingBox,
  )
  const unindexed = (response?.UnindexedFaces || []).map((face) => ({
    ...face.FaceDetail?.BoundingBox,
    color: IGNORED_FACE_COLOR,
  }))
  return [...indexed, ...unindexed]
}

export const getModeByValue = (value) => {
  switch (value) {
    case 'H':
      return 'High/Low'
    case 'HS':
      return 'High/Low Spread'
    case 'T':
      return 'Lightning'
    case 'TS':
      return 'Lightning Spread'
    default:
      return ''
  }
}

export const getPeriodByValue = (value) => {
  if (!value) return ''
  const val = value.split(':')
  const hour = parseInt(val[0])
  const minute = parseInt(val[1])
  const second = parseInt(val[2])
  let str = ''
  if (hour) {
    if (hour >= 24) {
      const day = Math.floor(hour / 24)
      const h = hour - day * 24
      if (day <= 1) {
        str = day + ' ' + t('highLow.day')
      }
      if (day >= 2) {
        str = day + ' ' + t('highLow.days')
      }
      if (h > 0 && h <= 1) {
        str += ' ' + h + ' ' + t('highLow.hour')
      }
      if (h > 1) {
        str += ' ' + h + ' ' + t('highLow.hours')
      }
    } else {
      if (hour > 0 && hour <= 1) {
        str += ' ' + hour + ' ' + t('highLow.hour')
      }
      if (hour > 1) {
        str += ' ' + hour + ' ' + t('highLow.hours')
      }
    }
  }
  if (minute) {
    if (minute > 0 && minute <= 1) {
      str += ' ' + minute + ' ' + t('highLow.minute')
    }
    if (minute > 1 && minute !== 60) {
      str += ' ' + minute + ' ' + t('highLow.minutes')
    }
    if (minute === 60) {
      str += ' ' + 1 + ' ' + t('highLow.hour')
    }
  }
  if (second) {
    str += ' ' + second + ' ' + t('highLow.seconds')
  }
  return str
}

export function translate(text: string, ...params) {
  if (!text) return ''
  return te(text) ? t(text, ...(params as [])) : text
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

export function getUserIdFromSumsubExternalId(sumsubExternalId: string) {
  if (!sumsubExternalId) return ''
  return sumsubExternalId.split('___')[1]
}

export function buildUrl(base: string, path: string) {
  if (base.endsWith('/')) {
    return `${base}${path}`
  }
  return `${base}/${path}`
}
