import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class ListWinningRateDTO {
  @ApiProperty({ name: 'page', required: true })
  @Expose()
  page: number

  @ApiProperty({ name: 'limit', required: true })
  @Expose()
  limit: number

  @ApiProperty({ name: 'pair', required: false })
  @Expose({ name: 'pair' })
  pair: string

  @ApiProperty({ name: 'mode', required: false })
  @Expose({ name: 'mode' })
  mode: string

  @ApiProperty({ name: 'period', required: false })
  @Expose({ name: 'period' })
  period: string
}
