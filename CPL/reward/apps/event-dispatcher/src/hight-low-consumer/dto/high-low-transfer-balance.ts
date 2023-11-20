import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, IsString } from 'class-validator'

export class HighLowTransferBalanceDto {
  @Expose({ name: 'created_at' })
  @Type(() => Number)
  @IsNumber()
  createTime: number

  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  @Expose()
  @IsString()
  id: string

  @Expose()
  @IsString()
  currency: string

  @Expose()
  @IsString()
  type: string

  @Expose({ name: 'transfer_amount' })
  @Type(() => Number)
  @IsNumber()
  transferAmount: string

  @Expose({ name: 'wallet_type' })
  @IsString()
  @Type(() => String)
  walletType: string
}

// Example:
// {
//   "id": "23170",
//   "user_id": "55324",
//   "currency": "btc",
//   "type": "EXCHANGE",
//   "actual_balance": "99999999999.099943740000000000",
//   "available_balance": "99999999999.099943740000000000",
//   "created_at": "1668049626734",
//   "updated_at": "1673508011346",
//   "version": 282,
//   "transfer_amount": "0.1"
// }
