import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { BaseOrderQueryDto } from './base-order.dto'

export enum TRADE_SEARCH_KEY {
  BUY_ORDER_ID = 'buy_order_id',
  BUY_EMAIL = 'buy_email',
  SELL_ORDER_ID = 'sell_order_id',
  SELL_EMAIL = 'sell_email',
  TRADE_ID = 'id',
  ALL = 'all',
}

export enum TRANSACTION_FEE_WALLET_TYPE {
  SPOT = 1,
  REWARD = 2,
}

export class GetListTradeHistoryQueryDto extends BaseOrderQueryDto {
  @ApiPropertyOptional({
    name: 'search_by_field',
    enum: Object.values(TRADE_SEARCH_KEY),
    description: `${TRADE_SEARCH_KEY.BUY_EMAIL} -> buy_email,
    ${TRADE_SEARCH_KEY.BUY_ORDER_ID} -> buy_order_id,
    ${TRADE_SEARCH_KEY.SELL_EMAIL} -> sell_email,
    ${TRADE_SEARCH_KEY.SELL_ORDER_ID} -> sell_order_id,
    ${TRADE_SEARCH_KEY.TRADE_ID} -> id,
    ${TRADE_SEARCH_KEY.ALL} -> all`,
  })
  @Expose({ name: 'search_by_field' })
  @IsEnum(TRADE_SEARCH_KEY)
  @IsOptional()
  searchByField?: TRADE_SEARCH_KEY
}

export class ExportTradeHistoryRequestDto extends GetListTradeHistoryQueryDto {
  @Expose()
  @ApiProperty({
    name: 'email',
    example: `exchange@cryptopie-labo.com`,
    nullable: true,
  })
  @IsNotEmpty()
  email: string
}

export class TradeHistoryItemDto {
  @ApiProperty({ name: 'trade_id' })
  @Expose({ name: 'trade_id', toPlainOnly: true })
  @IsNumberString()
  @IsNotEmpty()
  tradeId: string

  @ApiProperty({ name: 'create_time' })
  @Expose({ name: 'create_time', toPlainOnly: true })
  @IsNumberString()
  @IsNotEmpty()
  createTime: string

  @ApiProperty({ name: 'buyer_id' })
  @Expose({ name: 'buyer_id', toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  buyerId: string

  @ApiProperty({ name: 'seller_id' })
  @Expose({ name: 'seller_id', toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  sellerId: string

  @ApiProperty({ name: 'buy_order_id' })
  @Expose({ name: 'buy_order_id', toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  buyOrderId: string

  @ApiProperty({ name: 'sell_order_id' })
  @Expose({ name: 'sell_order_id', toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  sellOrderId: string

  @ApiProperty({ name: 'sell_fee' })
  @Expose({ name: 'sell_fee', toPlainOnly: true })
  @IsNumberString()
  @IsNotEmpty()
  sellFee: string

  @ApiProperty({ name: 'buy_fee' })
  @Expose({ name: 'buy_fee', toPlainOnly: true })
  @IsNumberString()
  @IsNotEmpty()
  buyFee: string

  @ApiProperty({ name: 'buy_currency' })
  @Expose({ name: 'buy_currency', toPlainOnly: true })
  @IsNotEmpty()
  buyCurrency: string

  @ApiProperty({ name: 'sell_currency' })
  @Expose({ name: 'sell_currency', toPlainOnly: true })
  @IsNotEmpty()
  sellCurrency: string

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coin: string

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string

  @Expose()
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  price: string

  @Expose()
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  filled: string

  @ApiProperty({ name: 'sell_email' })
  @Expose({ name: 'sell_email', toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  sellEmail: string

  @ApiProperty({ name: 'buy_email' })
  @Expose({ name: 'buy_email', toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  buyEmail: string

  @Expose({ name: 'buy_fee_wallet_type' })
  @IsEnum(TRANSACTION_FEE_WALLET_TYPE)
  buyFeeWalletType: TRANSACTION_FEE_WALLET_TYPE

  @Expose({ name: 'sell_fee_wallet_type' })
  @IsEnum(TRANSACTION_FEE_WALLET_TYPE)
  sellFeeWalletType: TRANSACTION_FEE_WALLET_TYPE
}

export class GrpcTradeHistoryPaginationResponse extends BasePaginationDto<
  TradeHistoryItemDto[]
> {
  @ApiProperty({ type: [TradeHistoryItemDto] })
  @Type(() => TradeHistoryItemDto)
  @ValidateNested({ each: true })
  @Expose()
  data: TradeHistoryItemDto[] = []
}

export class GrpcExportTradeHistoryResponse {
  @ApiProperty({ name: 'status' })
  @ApiProperty({ name: 'status' })
  @Expose({ name: 'status' })
  status: boolean
}
