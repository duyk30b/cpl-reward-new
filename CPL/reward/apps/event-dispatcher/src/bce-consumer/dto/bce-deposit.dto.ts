import { Expose, Transform, Type } from 'class-transformer'
import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator'

export class BceDepositDto {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose({ name: 'id' })
  @IsNumber()
  id: string

  @Expose({ name: 'transaction_id' })
  @IsString()
  transactionId: string

  @Expose({ name: 'type' })
  @IsString()
  type: string

  @Expose({ name: 'currency' })
  @IsString()
  currency: string

  @Expose({ name: 'amount' })
  @IsString()
  amount: string

  @Expose({ name: 'fee' })
  @IsString()
  fee: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => Math.floor(Number(value) / 1000))
  @IsNumber()
  createdAt: number

  @Expose({ name: 'is_missing_event' })
  @IsBoolean()
  isMissingEvent: string

  @Expose({ name: 'is_first_time' })
  @IsBoolean()
  isFirstTime: string
}

// Example
// {
// 	"id": 17129,
// 	"transaction_id": "906dea1ed6ae3202ae7298969a5f97ac2816131c",
// 	"user_id": 67913,
// 	"type": "deposit",
// 	"currency": "btc",
// 	"amount": "100.0000000000",
// 	"fee": "0.0000000000",
// 	"created_at": 1681387080000,
// 	"is_missing_event": false,
// 	"is_first_time": true
// }
