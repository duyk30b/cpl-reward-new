import { Expose, Transform, Type } from 'class-transformer'
import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator'

export class HighLowCancelDto {
  @Expose({ name: 'created_at_unix' })
  @Transform(({ value }) => Math.floor((value || Date.now()) / 1000))
  @IsNumber()
  createdAtUnix: number

  @Expose({ name: 'allow_resell' })
  @IsNumber()
  allowResell: number

  @Expose({ name: 'balance_id' })
  @IsNumber()
  balanceId: number

  @Expose({ name: 'bcast_use' })
  @IsNumber()
  bcastUse: number

  @Expose({ name: 'buy_payout' })
  @IsNumber()
  buyPayout: number

  // @Expose({ name: 'buy_time' })
  // @Transform(({ value }) => new Date(value).getTime())
  // @IsNumber()
  // buyTime: number

  @Expose({ name: 'closing_rate' })
  @IsString()
  closingRate: string

  @Expose({ name: 'decimal_part' })
  @IsNumber()
  decimalPart: number

  @Expose({ name: 'end_time' })
  @IsString()
  endTime: string

  @Expose({ name: 'expire_payout' })
  @Type(() => String)
  @IsString()
  expirePayout: string

  @Expose({ name: 'expire_time' })
  @Transform(({ value }) => new Date(value).getTime())
  @IsNumber()
  expireTime: number

  @Expose({ name: 'frame_active' })
  @IsString()
  frameActive: number

  @Expose({ name: 'id' })
  @IsNumber()
  id: number

  @Expose({ name: 'invest' })
  @IsNumber()
  invest: number

  @Expose({ name: 'is_demo' })
  @IsNumber()
  isDemo: number

  @Expose({ name: 'is_first_time' })
  @IsBoolean()
  isFirstTime: boolean

  @Expose({ name: 'mode_id' })
  @IsNumber()
  modeId: number

  @Expose({ name: 'odds_mode' })
  @IsNumber()
  oddsMode: number

  @Expose({ name: 'odds_fee' })
  @IsNumber()
  oddsFee: number

  @Expose({ name: 'pair_id' })
  @IsNumber()
  pairId: number

  @Expose({ name: 'pair_index' })
  @IsNumber()
  pairIndex: number

  @Expose({ name: 'payout' })
  @IsNumber()
  payout: number

  @Expose({ name: 'profit' })
  @Type(() => String)
  @IsString()
  profit: string

  @Expose({ name: 'rank_payout' })
  @IsNumber()
  rankPayout: number

  @Expose({ name: 'resell_expire' })
  @Transform(({ value }) => new Date(value).getTime())
  @IsNumber()
  resellExpire: number

  @Expose({ name: 'sell_payout' })
  @IsNumber()
  sellPayout: number

  @Expose({ name: 'start_time' })
  @IsString()
  startTime: string

  @Expose({ name: 'status' })
  @IsString()
  status: string

  @Expose({ name: 'strike' })
  @IsNumber()
  strike: number

  @Expose({ name: 'trade_type' })
  @IsString()
  tradeType: number

  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose({ name: 'wallet_type' })
  @IsString()
  @Type(() => String)
  walletType: string
}
