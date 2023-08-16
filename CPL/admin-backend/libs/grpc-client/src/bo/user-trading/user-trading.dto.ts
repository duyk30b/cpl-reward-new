import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import { IGrpcUserTrading } from './user-trading.interface'

export class GrpcUserTradingDTO {
  @Expose()
  id: number

  @Expose({ name: 'balance_id' })
  balanceId: number

  @Expose({ name: 'mode_id' })
  modeId: number

  @Expose({ name: 'pair_id' })
  pairId: number

  @Expose()
  strike: number

  @Expose({ name: 'trade_type' })
  tradeType: string

  @Expose()
  invest: number

  @Expose({ name: 'bcast_use' })
  bcastUse: number

  @Expose({ name: 'buy_time' })
  buyTime: Date

  @Expose()
  payout: number

  @Expose({ name: 'start_time' })
  startTime: Date

  @Expose({ name: 'end_time' })
  endTime: Date

  @Expose({ name: 'expire_time' })
  expireTime: Date

  @Expose({ name: 'closing_rate' })
  closingRate: number

  @Expose({ name: 'expire_payout' })
  expirePayout: number

  @Expose()
  profit: number

  @Expose({ name: 'rank_payout' })
  rankPayout: number

  @Expose({ name: 'decimal_part' })
  decimalPart: number

  @Expose({ name: 'buy_payout' })
  buyPayout: number

  @Expose({ name: 'sell_payout' })
  sellPayout: number

  @Expose()
  status: string

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  updatedAt: number

  @Expose({ name: 'resell_expire' })
  resellExpire: Date

  @Expose({ name: 'allow_resell' })
  allowResell: number

  @Expose({ name: 'odds_mode' })
  oddsMode: number

  @Expose({ name: 'odds_fee' })
  oddsFee: number

  @Expose({ name: 'pair_index' })
  pairIndex: number

  @Expose({ name: 'frame_active' })
  frameActive: string

  @Expose({ name: 'is_demo' })
  isDemo: number

  @Expose({ name: 'ignore_flag' })
  ignoreFlag: number

  @Expose({ name: 'client_time' })
  clientTime: number

  @Expose({ name: 'server_time' })
  serverTime: number

  @Expose({ name: 'cashback_transaction_id' })
  cashbackTransactionId: number

  @Expose({ name: 'cashback_recovery_transaction_id' })
  cashbackRecoveryTransactionId: number

  @Expose({ name: 'cashback_profit' })
  cashbackProfit: number
}

export class BaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcUserTradingResponseDTO extends BaseResponseDTO {
  data?: IGrpcUserTrading
}

export class ListGrpcUserTradingResponseDTO extends BaseResponseDTO {
  data?: {
    items: IGrpcUserTrading[]
    meta: IPaginationMeta
  }
}

export class TradingLimitUserDTO {
  @Expose()
  balanceProfit: number

  @Expose()
  investmentType: string

  @Expose()
  sumExpirePayout: number

  @Expose()
  email: number

  @Expose()
  sumProfit: number

  @Expose()
  thresholdLimit: number

  @Expose()
  createdAt: number

  @Expose()
  userId: number
}
