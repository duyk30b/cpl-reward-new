import BigNumber from 'bignumber.js'

export const comparison = (a: any, operator: string, b: any, type = 'string') => {
  if (type === 'boolean') {
    a = [true, 'true', 1].includes(a)
    b = [true, 'true', 1].includes(b)
    if (operator === '==') return a == b
    if (operator === '!=') return a != b
    return false
  }
  if (type === 'string') {
    if (operator === '==') return a.toString() == b.toString()
    if (operator === '!=') return a.toString() != b.toString()
    return false
  }
  if (type === 'unix_timestamp') {
    a = /^\d+$/.test(a) ? Number(a) : Math.ceil(new Date(a).getTime() / 1000)
    b = Number(b)
    if (operator === '==') return a == b
    if (operator === '!=') return a != b
    if (operator === '>') return a > b
    if (operator === '>=') return a >= b
    if (operator === '<') return a < b
    if (operator === '<=') return a <= b
    return false
  }
  if (type === 'number') {
    const aa = new BigNumber(a || 0)
    const bb = new BigNumber(b)

    if (operator === '==') return aa.eq(bb)
    if (operator === '>') return aa.gt(bb)
    if (operator === '>=') return aa.gte(bb)
    if (operator === '<') return aa.lt(bb)
    if (operator === '<=') return aa.lte(bb)
    if (operator === '!=') return !aa.eq(bb)
    return false
  }
}

/**
 * @param checkInTime - Use number of millisecond. Example: Date.now() / 1000
 * @param lastCheckIn - Use number of millisecond. Example: Date.now() / 1000
 * @param resetTime - Format HH:mm. Example: "17:01"
 */
export const canCheckInDaily = (checkInTime: number, lastCheckIn: number, resetTime: string) => {
  const reset = new Date(lastCheckIn * 1000)
  const [hours, minutes] = resetTime.split(':')
  reset.setUTCHours(Number(hours))
  reset.setUTCMinutes(Number(minutes))
  if (reset.getTime() < lastCheckIn * 1000) reset.setUTCDate(reset.getUTCDate() + 1)

  return checkInTime * 1000 > reset.getTime()
}
