import { MAX_NUMBER_DECIMALS } from '@app/common/constants'
import { isDecimal, notContains } from 'class-validator'

export function isFixedNumberString(value: unknown) {
  return (
    isDecimal(value, { decimal_digits: '0,' + MAX_NUMBER_DECIMALS }) &&
    notContains(value, '+')
  )
}
