import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class TradingPairDTO {
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

export class ApiCreateTradingPairDTO {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  symbol: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  active: number

  @ApiProperty({ name: 'binance_symbol' })
  @Expose({ name: 'binance_symbol' })
  @IsNotEmpty()
  @Length(0, 255)
  binanceSymbol: string

  @ApiProperty({ name: 'image' })
  @Expose({ name: 'image' })
  @IsNotEmpty()
  @Length(0, 255)
  image: string
}

export class ApiUpdateStatusTradingPairDTO {
  @Expose()
  id: number

  @ApiProperty({ name: 'active' })
  @Expose({ name: 'active' })
  active: number
}

export class ApiUpdateTradingPairDTO {
  @Expose()
  id: number

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  symbol: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  active: number

  @ApiProperty({ name: 'binance_symbol' })
  @Expose({ name: 'binance_symbol' })
  @IsNotEmpty()
  @Length(0, 255)
  binanceSymbol: string

  @ApiProperty({ name: 'image' })
  @Expose({ name: 'image' })
  @IsNotEmpty()
  @Length(0, 255)
  image: string
}

export class ListTradingPairDTO {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  limit: number

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

  @ApiProperty({ name: 'get_only', required: false, enum: ['true', 'false'] })
  @Expose({ name: 'get_only' })
  getOnly: 'true' | 'false'
}

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class DeleteTradingPairDTO {
  @ApiProperty()
  @Expose()
  id: number
}
