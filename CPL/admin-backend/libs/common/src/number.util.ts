import BigNumber from 'bignumber.js'

export class NumberUtil {
  public static add(a: string, b: string): string {
    return new BigNumber(a).plus(b).toString()
  }

  public static sub(a: string, b: string): string {
    return new BigNumber(a).minus(b).toString()
  }

  public static div(a: string, b: string): string {
    return new BigNumber(a).dividedBy(b).toString()
  }

  public static isZero(a: string): boolean {
    return new BigNumber(a).isZero()
  }

  public static eq(a: string, b: string): boolean {
    // Returns true if and only if a is equal to b.
    return new BigNumber(a).eq(b)
  }

  public static lt(a: string, b: string): boolean {
    // Returns true if and only if a < b.
    return new BigNumber(a).lt(b)
  }

  public static lte(a: string, b: string): boolean {
    // Returns true if and only if a <= b.
    return new BigNumber(a).lte(b)
  }

  public static gt(a: string, b: string): boolean {
    // Returns true if and only if a > b.
    return new BigNumber(a).gt(b)
  }

  public static gte(a: string, b: string): boolean {
    // Returns true if and only if a >= b.
    return new BigNumber(a).gte(b)
  }

  public static toFixed(a: string, decimalPaces?: number): string {
    if (decimalPaces == undefined) decimalPaces = NumberUtil.getPrecision(a)

    return new BigNumber(a).toFixed(decimalPaces).toString()
  }

  public static getPrecision(a: string): number {
    return new BigNumber(a).decimalPlaces()
  }

  public static generatePrecision(maxPrecision: number) {
    if (maxPrecision === 0) return '1'
    return '0.' + '0'.repeat(maxPrecision - 1) + '1'
  }
}
