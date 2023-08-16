import { BaseResponseDto } from '@lib/grpc-client/grpc-client.dto'
import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import { IGrpcBlockUser } from './block-user.interface'

export class GrpcBlockUserDTO {
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

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'email' })
  email: string

  @Expose({ name: 'name' })
  name: string

  @Expose({ name: 'last_login' })
  lastLogin: string
}

export class GrpcBaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcBlockUserResponseDTO extends BaseResponseDto {
  data?: IGrpcBlockUser
}

export class ListGrpcBlockUserResponseDTO extends BaseResponseDto {
  data?: {
    items: IGrpcBlockUser[]
    meta: IPaginationMeta
  }
}

export class GrpcUserBlockDTO {
  @Expose()
  id: number

  @Expose({ name: 'userId' })
  user_id: string

  @Expose()
  email: string

  @Expose()
  name: string

  @Expose({ name: 'reason' })
  reason: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}

export class GrpcUserBlockResponseDTO extends BaseResponseDto {
  data?: {
    items: GrpcUserBlockDTO[]
    meta: IPaginationMeta
  }
}
