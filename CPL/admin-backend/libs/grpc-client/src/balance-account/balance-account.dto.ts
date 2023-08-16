import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class BalanceAccountDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string

  @ApiProperty()
  @Expose()
  currency: string

  @ApiProperty({ name: 'actual_balance' })
  @Expose({ name: 'actual_balance', toPlainOnly: true })
  actualBalance: string

  @ApiProperty({ name: 'available_balance' })
  @Expose({ name: 'available_balance', toPlainOnly: true })
  availableBalance: string

  @ApiProperty()
  @Expose()
  type: string

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: string

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: string
}
