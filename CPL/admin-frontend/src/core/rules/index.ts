import { translate } from '@/core/helpers/common.helper'
import {
  addNumberString,
  getPrecision,
  gt,
  isZero,
  lt,
} from '@/core/helpers/util'
import {
  MAX_DECIMAL_TOTAL_ROUND,
  MAX_DIGITS_LEFT_RIGHT,
} from '@/core/variables/common.const'
import { UserKycService } from '@/services/UserKycService'
import { digits, email, integer, max, required } from '@vee-validate/rules'
import { defineRule } from 'vee-validate'

export const MIN_FEE_PERCENT = '0.0001'
export const MAX_FEE_PERCENT = '100'

defineRule('contains', (value: string, params: string[]) => {
  if (!params || !Array.isArray(params)) {
    return translate('VALIDATION.NOT_CONTAINS_IN_LIST')
  }
  if (!params.some((item) => item.includes(value))) {
    return translate('VALIDATION.NOT_CONTAINS_IN_LIST')
  }
  return true
})

defineRule(
  'required',
  (value) => required(value) || translate('VALIDATION.REQUIRED'),
)
defineRule('email', (value) => email(value) || translate('VALIDATION.EMAIL'))
defineRule(
  'excluded',
  (value) => email(value) || translate('VALIDATION.EXCLUDED'),
)
defineRule(
  'integer',
  (value) => integer(value) || translate('VALIDATION.INTEGER'),
)
defineRule(
  'max',
  (value, length) => max(value, length) || translate('VALIDATION.MAX'),
)
defineRule('min', (value, params) => {
  if (!params) {
    return 'Value for min validate is required'
  }
  if (lt(String(value), params[0])) {
    // params[1] field name
    if (!params[1]) {
      return 'Must be greater than or equal to ' + params[0]
    }
    return `This must be greater than or equal to the ${params[1] || ''}.`
  }
  return true
})

defineRule('maxLength', (value, [length]) => {
  return (
    !value ||
    value.length <= parseInt(length) ||
    translate('VALIDATION.MAX_LENGTH', { length })
  )
})

defineRule('positiveNumber', (value: number) => {
  if (Number(value) <= 0) {
    return 'Number must be greater than 0'
  }
  return true
})
defineRule('feeSetting', (value: number) => {
  if (isZero(value.toString())) {
    return true
  }
  if (Number(value) < 0) {
    return 'Number must be greater than or equal 0'
  }
  if (lt(value.toString(), MIN_FEE_PERCENT)) {
    return `Number must be greater than or equal ${MIN_FEE_PERCENT}`
  }
  if (gt(value.toString(), MAX_FEE_PERCENT)) {
    return `Number must be less than or equal ${MAX_FEE_PERCENT}`
  }
  return true
})

defineRule('maximumTotalNumber', (value: string, argv: any[]) => {
  if ((!argv || !argv.length) && (Number(value) <= 0 || !Number(value))) {
    return 'Number is invalid'
  }
  const [left, right] = value.split('.')
  if (gt(right?.length.toString() || '0', argv[0])) {
    return `The maximum number of digits to the right of the decimal point is ${argv[0]}`
  }
  if (
    gt(
      addNumberString(left?.length.toString(), right?.length.toString() || '0'),
      MAX_DIGITS_LEFT_RIGHT.toString(),
    )
  ) {
    return `Total number right side and left side must be less than or equal ${MAX_DIGITS_LEFT_RIGHT.toString()}`
  }
  return true
})

defineRule('maximumMinimumTotalNumber', (value: string, argv?: any[]) => {
  if ((!argv || !argv.length) && (Number(value) <= 0 || !Number(value))) {
    return 'Number is invalid'
  }
  const [left, right] = value.split('.')
  if (gt(right?.length.toString() || '0', MAX_DECIMAL_TOTAL_ROUND.toString())) {
    return `The maximum number of digits to the right of the decimal point is ${MAX_DECIMAL_TOTAL_ROUND}`
  }
  if (
    gt(
      addNumberString(left?.length.toString(), right?.length.toString() || '0'),
      '20',
    )
  ) {
    return 'Total number right side and left side must be less than or equal 20'
  }
  return true
})

defineRule('decimals', (value: string, params) => {
  if (!params) {
    return 'Value of decimals is required'
  }
  if (getPrecision(value) > params[0]) {
    if (params[1] && params[2]) {
      return `${params[1]} must be less than or equal the value of ${params[2]}`
    }
    return 'Decimals must be less than or equal ' + params[0] + ' digits'
  }
  return true
})

defineRule('decimalPlace', (value: string, argv: any[]) => {
  if (value && value.length && argv && argv.length) {
    if (getPrecision(value) + getPrecision(argv[0]) > MAX_DECIMAL_TOTAL_ROUND) {
      return `The sum of the maximum decimals of price and amount should not be more than ${MAX_DECIMAL_TOTAL_ROUND}`
    }
    return true
  }
  return 'Value of decimals is required'
})

defineRule(
  'digits',
  (value, length) => digits(value, length) || translate('VALIDATION.DIGITS'),
)
defineRule(
  'idDocumentUnique',
  async (value, [exceptUserId, idDocumentType, countryId]) => {
    if (!value) return true
    const res = await UserKycService.checkDuplicateIdDocumentNo({
      except_user_id: exceptUserId,
      id_document_no: value,
      id_document_type: idDocumentType,
      country_id: countryId,
    })
    return res.valid || translate('VALIDATION.ID_DOCUMENT_UNIQUE')
  },
)
defineRule('minMaxCustom', (value, [min, max]) => {
  // The field is empty so it should pass
  if (!value) {
    return true
  }
  const numericValue = Number(value)
  if (numericValue < min) {
    return `This field must be greater than or equal ${min}`
  }
  if (numericValue > max) {
    return `This field must be less than or equal ${max}`
  }
  return true
})
defineRule('isStringNumber', async (value) => {
  if (!value) return true
  if (typeof value != 'string' && typeof value != 'number') return false // we only process strings!
  if (
    !isNaN(+value) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(String(value)))
  )
    return true
  return 'Invalid number'
})
defineRule(
  'confirmed',
  (value, [target]) => value === target || translate('VALIDATION.CONFIRM'),
)
defineRule('afterOrEqualNow', async (value) => {
  if (value && value < new Date().getTime()) {
    return translate('VALIDATION.AFTER_OR_EQUAL_NOW')
  }
  return true
})
defineRule('isRangeFloatNumber', async (value, maxDecimal: number) => {
  const parts = value.split('-')
  if (
    parts.length !== 2 ||
    isNaN(parts[0]) ||
    isNaN(parts[1]) ||
    +parts[0] === 0 ||
    +parts[1] === 0
  ) {
    return 'Invalid range number. Ex: 100-1000.'
  }
  if (+parts[0] >= +parts[1]) {
    return 'Invalid range number. First value must be less than second value.'
  }
  // check decimals
  const decimalsNum1 = parts[0].split('.')
  if (decimalsNum1.length == 2) {
    if (decimalsNum1[1].length > maxDecimal) {
      return `Max decimals less than or equals ${maxDecimal}`
    }
  }
  const decimalsNum2 = parts[1].split('.')
  if (decimalsNum2.length == 2) {
    if (decimalsNum2[1].length > maxDecimal) {
      return `Max decimals less than or equals ${maxDecimal}`
    }
  }
  return true
})
defineRule('isRangeIntegerNumber', async (value: string) => {
  const parts = value.split('-')
  if (
    parts.length !== 2 ||
    isNaN(+parts[0]) ||
    isNaN(+parts[1]) ||
    +parts[0] === 0 ||
    +parts[1] === 0
  ) {
    return 'Invalid range number. Ex: 100-1000.'
  }
  if (+parts[0] >= +parts[1]) {
    return 'Invalid range number. First value must be less than second value.'
  }
  if (!/^[0-9]+$/.test(parts[0]) || !/^[0-9]+$/.test(parts[1])) {
    return 'Invalid range number. Data must be integer value.'
  }
  return true
})
defineRule('maxRange', async (value: string, maxValue: number) => {
  const parts = value.split('-')
  if (+parts[1] > maxValue) {
    return `Invalid max range. Max range must be less than or equal ${maxValue}.`
  }
  return true
})

/**
 * Author: TuanCM
 * Service: Future Setting
 */
defineRule('requiredObListPriceScale', async (value: string[]) => {
  if (value.length < 1) return 'This field is required.'

  return true
})
defineRule('requiredTradingListLeverage', async (value: string[]) => {
  if (value.length < 1) return 'This field is required.'

  return true
})
/**
 * End rules
 */
