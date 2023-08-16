import CONFIG from '@/config'
import { BALANCE_TYPE, TRANSACTION_TYPE } from '@/enums/balance.enum'
import { TRANSACTION_STATUS } from '@/enums/wallet-bce-admin.enum'
import { PairItem } from '@/models/setting-exchange/TradingPair'
import {
  GRID_TYPE,
  SEARCH_BY_FIELD,
  STRATEGY_STATUS,
} from '@/models/spot-grid-trading/enum'
import { BigNumber } from 'bignumber.js'
import { plainToClass } from 'class-transformer'
import { isString } from 'lodash'
import moment from 'moment'
import numeral from 'numeral'

export function toFixed(a: string, decimalPaces?: number): string {
  if (decimalPaces == undefined) decimalPaces = getPrecision(a)

  return new BigNumber(a).toFixed(decimalPaces).toString()
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getListPair(
  listCoin: string[],
  listIgnorePair?: PairItem[],
): PairItem[] {
  const currencyList: string[] = CONFIG.CURRENCY_LIST || []
  const ignoreCoinList: string[] = CONFIG.NOT_COIN_LIST || []
  const result: PairItem[] = []
  for (const coin of listCoin) {
    for (const currency of currencyList) {
      if (
        !ignoreCoinList.find((item) => {
          return coin === item
        }) &&
        coin != currency &&
        !listIgnorePair?.find((item) => {
          return item.coin == coin && item.currency == currency
        })
      ) {
        result.push(
          plainToClass(PairItem, {
            coin: coin,
            currency,
          }),
        )
      }
    }
  }
  return result
}

export function sortArrayOfObject<T>(
  array: Array<T>,
  key: string,
  growUp = true,
) {
  const clearArray: Array<T> = []
  const emptyArray: Array<T> = []
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.[key as keyof T]) {
      clearArray.push(array[i])
    } else {
      emptyArray.push(array[i])
    }
  }
  const result: Array<T> = clearArray.sort((a, b) =>
    new BigNumber(String(a?.[key as keyof T] || 0)).gt(
      String(b?.[key as keyof T] || 0),
    )
      ? 1
      : new BigNumber(String(b?.[key as keyof T] || 0)).gt(
          String(a?.[key as keyof T] || 0),
        )
      ? -1
      : 0,
  )
  if (growUp) {
    return [...emptyArray, ...result]
  } else {
    return [...emptyArray, ...result.reverse()]
  }
}

export function toNumber(value?: string | number | BigNumber) {
  if (typeof value === 'object') {
    return (value as BigNumber)?.toNumber() || 0
  }
  if (typeof value === 'string') {
    return new BigNumber(value || 0).toNumber()
  }
  return Number(value || 0)
}

export function removeTrailingZeros(value: string) {
  return value.replace(/\.0+$/g, '').replace(/(\.\d*?[1-9])0+$/g, '$1')
}

export function addCommasToNumber(value: string) {
  const parts = value.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function formatNumberString(value: string) {
  return addCommasToNumber(removeTrailingZeros(value))
}

export function isFalsy(value?: string | number | BigNumber) {
  if (typeof value === 'object') {
    return (value as BigNumber)?.isEqualTo(0) || (value as BigNumber)?.isNaN()
  }
  return new BigNumber(value || 0)?.isEqualTo(0) || !value
}

export function getPrecision(a: string | number): number {
  return new BigNumber(a).decimalPlaces()
}

export function lt(a: string, b: string): boolean {
  // Returns true if and only if a < b.
  return new BigNumber(a).lt(b)
}

export function lte(a: string, b: string): boolean {
  // Returns true if and only if a <= b.
  return new BigNumber(a).lte(b)
}

export function gt(a: string, b: string): boolean {
  // Returns true if and only if a > b.
  return new BigNumber(a).gt(b)
}

export function gte(a: string, b: string): boolean {
  // Returns true if and only if a >= b.
  return new BigNumber(a).gte(b)
}

export function divNumberString(a: string, b: string): string {
  return new BigNumber(a).dividedBy(b).toString()
}
export function mulNumberString(a: string, b: string): string {
  return new BigNumber(a).multipliedBy(b).toString()
}

export function addNumberString(a: string, b: string): string {
  return new BigNumber(a).plus(b).toString()
}

export function subNumberString(a: string, b: string): string {
  return new BigNumber(a).minus(b).toString()
}

export function isZero(a: string): boolean {
  return new BigNumber(a).isZero()
}

export function clearParams(params) {
  return Object.keys(params).reduce((res, cur) => {
    if (params[cur]) res[cur] = params[cur]
    return res
  }, {})
}

export function numberToString(x) {
  // avoids scientific notation for too large and too small numbers

  if (typeof x === 'string') return x

  const s = x.toString()
  if (Math.abs(x) < 1.0) {
    const n_e = s.split('e-')
    const n = n_e[0].replace('.', '')
    const e = parseInt(n_e[1])
    const neg = s[0] === '-'
    if (e) {
      x = (neg ? '-' : '') + '0.' + new Array(e).join('0') + n.substring(neg)
      return x
    }
  } else {
    const parts = s.split('e')
    if (parts[1]) {
      let e = parseInt(parts[1])
      const m = parts[0].split('.')
      let part = ''
      if (m[1]) {
        e -= m[1].length
        part = m[1]
      }
      return m[0] + part + new Array(e + 1).join('0')
    }
  }
  return s
}

export function convertNumber(value) {
  const decimal = getPrecision(value)
  if (decimal > 7) {
    return new BigNumber(value).toFixed(decimal).toString()
  }
  return numeral(new BigNumber(value).toFixed(decimal).toString()).format(
    `0,0.${new Array(decimal).fill('0', 0, decimal).join('')}`,
  )
}

export function getValueByCondition(value: string | number, format?: string) {
  if (isFalsy(value)) return '--'
  const decimalFormat = getPrecision(format || '0.01')
  let originalValue
  if (!format) {
    originalValue = new BigNumber(value).toFixed(getPrecision(value)).toString()
  } else {
    originalValue = new BigNumber(value).toFixed(decimalFormat)
  }
  const originalValueFormatted = originalValue.split('.')?.[1]
    ? `${numeral(originalValue.split('.')[0]).format('0,0')}.${
        originalValue.split('.')?.[1]
      }`
    : `${numeral(originalValue).format('0,0')}`
  return originalValueFormatted
}

export function getAmountByCondition(value: string | number, format?: string) {
  if (isFalsy(value)) return '--'
  const decimalFormat = getPrecision(format || '0.01')
  let originalValue
  if (!format) {
    originalValue = new BigNumber(value).toFixed(getPrecision(value)).toString()
  } else {
    if (format == '1') {
      originalValue = new BigNumber(Math.floor(+value)).toFixed(decimalFormat)
    } else {
      originalValue = new BigNumber(value).toFixed(decimalFormat)
    }
  }
  const originalValueFormatted = originalValue.split('.')?.[1]
    ? `${numeral(originalValue.split('.')[0]).format('0,0')}.${
        originalValue.split('.')?.[1]
      }`
    : `${numeral(originalValue).format('0,0')}`
  return originalValueFormatted
}

export function sortPairFn(
  [coin1, currency1]: string[],
  [coin2, currency2]: string[],
) {
  if (currency1 < currency2) {
    return -1
  } else if (currency1 > currency2) {
    return 1
  } else {
    if (coin1 < coin2) {
      return -1
    } else if (coin1 > coin2) {
      return 1
    }
  }
}

export function transactionTypeOption() {
  const transactionTypes = Object.values(TRANSACTION_TYPE)
    .filter(isString)
    .map((item) => {
      return { id: item, name: item }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return transactionTypes
}

export function balanceTypeOption() {
  const transactionTypes = Object.values(BALANCE_TYPE)
    .filter(isString)
    .map((item) => {
      return { id: item, name: item }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return transactionTypes
}

export function transactionStatus() {
  const transactionStatus = Object.values(TRANSACTION_STATUS)
    .filter(isString)
    .map((item) => {
      return item
    })

  return transactionStatus
}

export function formatCurrencyAmount(
  amount,
  currency,
  zeroValue,
  numberOfDecimalDigits,
) {
  if (!numberOfDecimalDigits) {
    numberOfDecimalDigits = currency === 'usd' ? 2 : 8
  }

  if (window._.isNil(zeroValue)) {
    zeroValue = ''
  }

  const rawValue = new BigNumber(`${amount}`).toFixed(numberOfDecimalDigits)
  return amount && parseFloat(amount) !== Infinity && !isNaN(amount)
    ? new BigNumber(rawValue).toFormat()
    : zeroValue
}

export function convertUTCToLocalTime(hour, minute) {
  const dateUTC = moment().format('YYYY-MM-DD')
  const hourUTC = hour
  const minuteUTC = minute
  const time = moment(dateUTC + ' ' + hourUTC + ':' + minuteUTC)
  return {
    hour: moment.parseZone(time).local().hour(),
    minute: moment.parseZone(time).local().minute(),
  }
}

export function formatUTCToLocalTime(date, format = 'YYYY-MM-DD hh:mm:ss') {
  if (!date) {
    return ''
  }
  return moment.utc(date).local().format(format)
}

export function getTimzoneOffset() {
  const d = new Date()
  return d.getTimezoneOffset()
}

export function convertLocalTimeToUTC(hour, minute) {
  const dateLocal = moment().format('YYYY-MM-DD')
  const hourLocal = hour
  const minuteLocal = minute
  const time = moment(dateLocal + ' ' + hourLocal + ':' + minuteLocal)
  return {
    hour: moment.utc(time).hour(),
    minute: moment.utc(time).minute(),
  }
}

export function formatTimeStamp(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp) {
    return ''
  }
  return moment(timestamp, 'x').format(format)
}

export function convertDatetimeToMilliseconds(timestamp) {
  if (!timestamp) {
    return ''
  }
  return moment.utc(timestamp).format('x')
}

export function mulBigNumber(number1, number2) {
  if (!number1 || !number2) {
    return '0'
  }
  return new BigNumber(number1).times(number2).toString()
}

export function jsonToCsv(json: any[], headerTitle?: string[]) {
  if (!json || json.length === 0) return ''
  const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  const header = Object.keys(json[0])
  const csv = json.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(','),
  )
  if (Array.isArray(headerTitle) && headerTitle.length > 0) {
    csv.unshift(headerTitle.join(','))
  } else {
    csv.unshift(header.join(','))
  }
  return csv.join('\r\n')
}

export function isDigit(e) {
  const char = String.fromCharCode(e.keyCode) // Get the character
  if (/^[0-9.]+$/.test(char)) return true
  // Match with regex
  else e.preventDefault() // If not match, don't add to input text
}

export function isNumber(e) {
  const char = String.fromCharCode(e.keyCode) // Get the character
  if (/^[0-9]+$/.test(char)) return true
  // Match with regex
  else e.preventDefault() // If not match, don't add to input text
}

export function futureFilterParams(params) {
  const [coin, currency] =
    params.coin_currency === undefined ? [] : params.coin_currency.split('/')
  const [from, to] =
    params.created_at_date === undefined ? [] : params.created_at_date
  if (coin !== undefined) params.coin = coin
  if (currency !== undefined) params.currency = currency
  if (from !== undefined)
    params.from = new Date(`${from} 00:00:00`).getTime().toString()
  if (to !== undefined)
    params.to = new Date(`${to} 23:59:59`).getTime().toString()
  if (params.coin_currency !== undefined) delete params.coin_currency
  if (params.created_at_date !== undefined) delete params.created_at_date
  if (params.search_text != undefined) params.order_id = params.search_text
  if (params.sort !== undefined) {
    params.sort_by = params.sort
    delete params.sort
  }
  return params
}

export function convertStrategyStatusToOptions() {
  return Object.values(STRATEGY_STATUS)
    .filter((v) => typeof v === 'string')
    .map((o) => ({
      id: STRATEGY_STATUS[o],
      name: o as string,
    }))
}

export function convertSearchFieldsToOptions() {
  return Object.values(SEARCH_BY_FIELD)
    .filter((v) => typeof v === 'string')
    .map((o) => ({
      id: SEARCH_BY_FIELD[o],
      name: o as string,
    }))
}

export function convertGridTypeToOptions() {
  return Object.values(GRID_TYPE)
    .filter((v) => typeof v === 'string')
    .map((o) => ({
      id: GRID_TYPE[o],
      name: o as string,
    }))
}

export function convertMillisecondToDateTime(milliseconds: string) {
  if (Number.isNaN(Number(milliseconds))) {
    throw new Error('milliseconds passed must be a number')
  }
  const duration = moment.duration(milliseconds)
  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()
  return `${days}D ${hours}H ${minutes}M`
}

export function formattedNumber(value: string | number) {
  if (Number.isNaN(Number(value))) {
    return '0'
  }
  const formattedNumber = Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: getPrecision(value),
  })
  return formattedNumber
}
