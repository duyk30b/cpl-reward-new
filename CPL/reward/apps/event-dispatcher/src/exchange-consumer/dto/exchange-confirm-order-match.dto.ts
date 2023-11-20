import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator'

export class OrderOrigin {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose()
  @IsString()
  currency: string

  @Expose()
  @IsString()
  coin: string

  @Expose({ name: 'order_type' })
  @IsNumber()
  orderType: number // tuong duong trade_type

  @Expose({ name: 'user_type' })
  @IsNumber()
  userType: number
}

export class OrderMatch {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose()
  @IsString()
  currency: string

  @Expose()
  @IsString()
  coin: string

  @Expose({ name: 'order_type' })
  @IsNumber()
  orderType: number // tuong duong trade_type

  @Expose({ name: 'user_type' })
  @IsNumber()
  userType: number
}

export class Order {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderOrigin)
  origin: OrderOrigin

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderMatch)
  match: OrderMatch
}

class Filled {
  @Expose({ name: 'gross_volume' })
  @IsString()
  grossVolume: string // tương đương với field 'quantity'
}

class ExchangeConfirmOrderMatchData {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Order)
  order: Order

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Filled)
  filled: Filled
}

export class ExchangeConfirmOrderMatchDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ExchangeConfirmOrderMatchData)
  data: ExchangeConfirmOrderMatchData
}

// Example:
// {
//   "create_time": "1673362890207",
//   "version": 0,
//   "data": {
//     "order": {
//       "origin": {
//         "order_id": "665208603548586336",
//         "user_id": "41369",
//         "currency": "usdt",
//         "coin": "twt",
//         "status": 2,
//         "order_class": 2,
//         "order_type": 1,
//         "order_resource": 1,
//         "price": "1.4639",
//         "user_type": 3,
//         "time_frame_setting": "1672901318319",
//         "filled_price": "1.4639"
//       },
//       "match": {
//         "order_id": "665208603552785323",
//         "user_id": "41369",
//         "currency": "usdt",
//         "coin": "twt",
//         "status": 2,
//         "order_class": 2,
//         "order_type": 2,
//         "order_resource": 1,
//         "price": "1.4639",
//         "user_type": 3,
//         "time_frame_setting": "1672901318319",
//         "filled_price": "1.4639"
//       }
//     },
//     "filled": {
//       "gross_volume": "140",
//       "price": "1.4639",
//       "match_time": "1673362890155",
//       "net_volume": "140",
//       "order_transaction_id": "40241973"
//     }
//   }
// }
