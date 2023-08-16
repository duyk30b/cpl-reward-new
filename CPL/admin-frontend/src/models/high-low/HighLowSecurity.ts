import { bigNumber } from '@/core/helpers/bigNumber'
import BigNumber from 'bignumber.js'
import { Expose, Transform } from 'class-transformer'

export class HighLowTotalRecordModel {
  @Expose({ name: 'lost' })
  lost: number

  @Expose({ name: 'total' })
  total: number

  @Expose({ name: 'win' })
  win: number

  @Expose()
  get winRatio(): BigNumber {
    const ratio = this.win / this.total

    return bigNumber(ratio)
  }

  @Expose()
  get isWinRatioSafe() {
    return !(this.winRatio.isGreaterThanOrEqualTo(0.9) && this.total > 5)
  }
}

export class HighLowProfitModel {
  @Expose({ name: 'profit' })
  @Transform(({ value }) => bigNumber(value))
  profit: BigNumber

  @Expose()
  get isProfitSafe() {
    return this.profit.isLessThanOrEqualTo(3000)
  }
}
