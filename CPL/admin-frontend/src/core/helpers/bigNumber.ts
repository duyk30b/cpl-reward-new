import BigNumber from 'bignumber.js'

export function bigNumber(value?: string | number | BigNumber) {
  return new BigNumber(String(value || 0).trim())
}

export function toString(
  value: string | number | BigNumber,
  options?: Partial<{ notANumber: boolean }>,
) {
  if (options?.notANumber) {
    return value?.toString()
  }
  if (typeof value === 'object' || typeof value === 'number') {
    const temp = (value as BigNumber | number)?.toString()
    if (temp.includes('e-')) {
      return new BigNumber(temp).plus(1).toString().replace('1', '0')
    }
    return temp
  } else {
    if (value.includes('e-')) {
      return new BigNumber(value).plus(1).toString().replace('1', '0')
    }
    return value || ''
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

export function isFalsy(value?: string | number | BigNumber) {
  if (typeof value === 'object') {
    return (
      new BigNumber(value as BigNumber)?.isEqualTo(0) ||
      new BigNumber(value as BigNumber)?.isNaN()
    )
  }
  return new BigNumber(value || 0)?.isEqualTo(0) || !value
}

export { BigNumber }
