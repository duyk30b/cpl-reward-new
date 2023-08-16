import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class PairPriceDTO {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false, example: 20 })
  @Expose({ name: 'per_page' })
  perPage: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export class ApiCreatePairPriceDTO {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  symbol: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  price: number

  @ApiProperty({ name: 'price_time' })
  @Expose({ name: 'price_time' })
  priceTime: Date
}

export class ApiUpdatePairPriceDTO {
  @Expose()
  id: number

  @ApiProperty({ required: false })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  symbol: string

  @ApiProperty({ required: false })
  @Expose()
  @IsNotEmpty()
  price: number

  @ApiProperty({ name: 'price_time' })
  @Expose({ name: 'price_time' })
  priceTime: Date
}

export class ListPairPriceDTO {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  limit: number

  @ApiProperty({ name: 'target_date', required: false })
  @Expose({ name: 'target_date' })
  targetDate: string

  @ApiProperty({ name: 'source', required: false })
  @Expose({ name: 'source' })
  source: string

  @ApiProperty({ name: 'global_trend', required: false })
  @Expose({ name: 'global_trend' })
  globalTrend: string

  @ApiProperty({ name: 'forced_flag', required: false })
  @Expose({ name: 'forced_flag' })
  forcedFlag: string

  @ApiProperty({ name: 'pair', required: false })
  @Expose({ name: 'pair' })
  pair: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class DeletePairPriceDTO {
  @ApiProperty()
  @Expose()
  id: number
}
