import { WALLET } from '@libs/typeorm/common/enum'
import { Expose } from 'class-transformer'

export class GetListRewardEarnedRequest {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  wallets: WALLET[]

  @Expose({ name: 'from_time' })
  fromTime: number

  @Expose({ name: 'to_time' })
  toTime: number
}

export class GetTotalRewardEarnedRequest extends GetListRewardEarnedRequest {
  @Expose()
  currency: string
}
