import { WALLET } from '@libs/typeorm/common/enum'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class GetRewardEarnedFilterDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({ name: 'wallets[]', required: false })
  @Expose()
  wallets: WALLET[]

  @ApiProperty({ name: 'from_time', required: false })
  @Expose({ name: 'from_time' })
  fromTime: number

  @ApiProperty({ name: 'to_time', required: false })
  @Expose({ name: 'to_time' })
  toTime: number
}
