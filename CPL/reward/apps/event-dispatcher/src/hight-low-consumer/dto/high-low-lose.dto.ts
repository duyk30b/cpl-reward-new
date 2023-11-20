import { Expose, Transform, Type } from 'class-transformer'
import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator'

export class HighLowLoseDto {
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

  @Expose({ name: 'payout' })
  @IsNumber()
  payout: number

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

// Example:
// {
//   "id": 413302,
//   "user_id": 58502,
//   "balance_id": 2484,
//   "mode_id": 1,
//   "pair_id": 1,
//   "strike": 21165.8,
//   "trade_type": "up",
//   "invest": 1,
//   "bcast_use": 0,
//   "buy_time": "2023-01-17 07:19:51",
//   "payout": 1.8,
//   "start_time": null,
//   "end_time": null,
//   "expire_time": "2023-01-17 07:19:56",
//   "closing_rate": "21160.07",
//   "expire_payout": "0",
//   "profit": "-1",
//   "rank_payout": 0,
//   "decimal_part": 2,
//   "buy_payout": 0,
//   "sell_payout": null,
//   "status": "closed",
//   "is_banned": 0,
//   "created_at": "2023-01-17 07:19:52",
//   "updated_at": "2023-01-17 07:19:57",
//   "resell_expire": "2023-01-17 07:19:26",
//   "allow_resell": 0,
//   "odds_mode": 0,
//   "odds_fee": 0,
//   "pair_index": 1,
//   "frame_active": "all",
//   "is_demo": 0,
//   "ignore_flag": 0,
//   "client_time": 1673939991372,
//   "server_time": 1673939991069,
//   "cashback_transaction_id": 16370936,
//   "cashback_recovery_transaction_id": null,
//   "cashback_profit": -1,
//   "mode": {
//     "id": 1,
//     "mode": "T",
//     "period": "00:00:05",
//     "start_time": "17:00:00",
//     "end_time": "17:00:00",
//     "payout": 1.8,
//     "suggestion_1": 10,
//     "suggestion_2": 50,
//     "suggestion_3": 100,
//     "scaling_active": 1,
//     "scaling_bcast": 2,
//     "payout_max": 2.82,
//     "rank_scaling_active": 1,
//     "limit_order_min": 1,
//     "limit_order_max": 15,
//     "limit_order_max_amount": 100000,
//     "order_expire_time": "00:00:30",
//     "order_unit": 1,
//     "limit_day_unit": 1,
//     "limit_order_times": 100,
//     "limit_order_amount": 1000000,
//     "stop_threshold_value": 50000,
//     "restricted_day_unit": 1,
//     "restricted_order_times": 1,
//     "restricted_day_order_times": 10000,
//     "restricted_day_order_amount": 50000,
//     "active_threshold_value": 999,
//     "restricted_order_amount": 10000,
//     "scaling_value": 0.1,
//     "rank1_scale_bcast": 0.1,
//     "rank2_scale_bcast": 0.12,
//     "rank3_scale_bcast": 0.2,
//     "api_token": "10547aabc193853a48ac1d63f63f0e0ae1891146326d8edc04dd9b523ba22625",
//     "allow_resell": 0,
//     "created_at": "2020-09-17 10:39:28",
//     "updated_at": "2020-09-17 10:39:28",
//     "odds_mode": 0,
//     "odds_fee": 0,
//     "payout_scaling_unit": 0.02,
//     "order_minimum": 0,
//     "expire_time": 0,
//     "emergency_threshold": 0,
//     "max_usdt_per_order": 1000,
//     "max_bcast_per_order": 5,
//     "same_direction_interval": 10,
//     "diff_direction_interval": 5
//   },
//   "pair": {
//     "id": 1,
//     "symbol": "BTC/USD",
//     "active": 1,
//     "binance_symbol": "BTC/USDT",
//     "type": 1
//   },
//   "is_first_time": false,
//   "avatar_url": "https://bce-prod-public.s3.ap-southeast-1.amazonaws.com/bo/Social_Lose_1.png",
//   "user_info": {
//     "created_at": 1659347795722,
//     "updated_at": 1659350924293,
//     "id": "591",
//     "user_id": "58502",
//     "user_info_history_id": "660",
//     "first_name": "lan",
//     "last_name": "nguyen",
//     "full_name": "lan nguyen",
//     "birthday": "2004-08-01",
//     "phone": "123456",
//     "phone_country": "355",
//     "building_room": "ứdefgh",
//     "address": "asdsf",
//     "city": "dddd",
//     "state_region": "d1d1234rt6yu2wertyh",
//     "zip_code": "12346",
//     "country_id": "1007",
//     "nationality_id": 1006,
//     "gender": 2,
//     "tel": "+355123456",
//     "region_code": "AL"
//   }
// }
