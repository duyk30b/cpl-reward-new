import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { ORDER_CLASS, ORDER_TYPE } from '@lib/grpc-client/exchange/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsEnum, ValidateNested } from 'class-validator'
import { ACTIVE_COPY, GRID_TYPE, STRATEGY_STATUS } from '../enum'
import { BasePaginationResponse } from './paginate-load-more.dto'

export class StrategyAdminDto {
  @Expose({ name: 'id' })
  id: string

  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose({ name: 'lower_price', toPlainOnly: true })
  lowerPrice: string

  @Expose({ name: 'higher_price', toPlainOnly: true })
  higherPrice: string

  @Expose()
  status: STRATEGY_STATUS

  @Expose()
  email: string

  @Expose({ name: 'total_investment', toPlainOnly: true })
  totalInvestment: string

  @Expose({ name: 'grid_number', toPlainOnly: true })
  gridNumber: number

  @Expose({ name: 'create_time', toPlainOnly: true })
  createTime: string

  @Expose({ name: 'owner_id', toPlainOnly: true })
  ownerId: string
}

export class GrpcGridTradingResponse extends BasePaginationDto<
  StrategyAdminDto[]
> {
  @ApiProperty({ name: 'data', type: [StrategyAdminDto] })
  @Type(() => StrategyAdminDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: StrategyAdminDto[] = []
}

export class GrpcGridBalanceDto {
  @Expose()
  @ApiProperty()
  currency: string

  @Expose()
  @ApiProperty()
  amount: string
}

export class GrpcStrategyDetailResponse {
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id' })
  id: string

  @Expose({ name: 'status' })
  @ApiProperty({ name: 'status' })
  status: STRATEGY_STATUS

  @Expose({ name: 'mode' })
  @ApiProperty({
    name: 'mode',
    enum: Object.values(GRID_TYPE).filter((v) => typeof v === 'number'),
  })
  mode: GRID_TYPE

  @Expose({ name: 'lower_price', toPlainOnly: true })
  @ApiProperty({ name: 'lower_price' })
  lowerPrice: string

  @Expose({ name: 'higher_price', toPlainOnly: true })
  @ApiProperty({ name: 'higher_price' })
  higherPrice: string

  @Expose({ name: 'grid_number', toPlainOnly: true })
  @ApiProperty({ name: 'grid_number' })
  gridNumber: number

  @Expose({ name: 'lower_profit_per_grid', toPlainOnly: true })
  @ApiProperty({ name: 'lower_profit_per_grid' })
  lowerProfitPerGrid: string

  @Expose({ name: 'higher_profit_per_grid', toPlainOnly: true })
  @ApiProperty({ name: 'higher_profit_per_grid' })
  higherProfitPerGrid: string

  @Expose({ name: 'start_price', toPlainOnly: true })
  @ApiProperty({ name: 'start_price' })
  startPrice: string

  @Expose({ name: 'stop_price', toPlainOnly: true })
  @ApiPropertyOptional({ name: 'stop_price' })
  stopPrice?: string

  @Expose({ name: 'trigger_price', toPlainOnly: true })
  @ApiPropertyOptional({
    name: 'trigger_price',
    description:
      'If return value is 0 => Strategy created have not trigger price',
  })
  triggerPrice?: string

  @Expose({ name: 'take_profit_point', toPlainOnly: true })
  @ApiPropertyOptional({
    name: 'take_profit_point',
    description:
      'If return value is 0 => Strategy created have not take profit point',
  })
  takeProfitPoint?: string

  @Expose({ name: 'stop_loss_point', toPlainOnly: true })
  @ApiPropertyOptional({
    name: 'stop_loss_point',
    description:
      'If return value is 0 => Strategy created have not stop loss point',
  })
  stopLossPoint?: string

  @Expose({ name: 'copiers' })
  @ApiProperty({ name: 'copiers' })
  copiers: number

  @Expose({ name: 'active_copy', toPlainOnly: true })
  @ApiProperty({
    name: 'active_copy',
    enum: Object.values(ACTIVE_COPY).filter((v) => typeof v === 'number'),
  })
  @IsEnum(ACTIVE_COPY)
  activeCopy: ACTIVE_COPY

  @Expose({ name: 'start_time', toPlainOnly: true })
  @ApiPropertyOptional({ name: 'start_time' })
  startTime?: string

  @Expose({ name: 'grid_profit', toPlainOnly: true })
  @ApiProperty({ name: 'grid_profit' })
  gridProfit: string

  @ApiProperty({ name: 'total_investment' })
  @Expose({ name: 'total_investment', toPlainOnly: true })
  totalInvestment: string

  @Expose({ name: 'total_profit', toPlainOnly: true })
  @ApiProperty({ name: 'total_profit' })
  totalProfit: string

  @Expose({ name: 'coin' })
  @ApiProperty({ name: 'coin' })
  coin: string

  @Expose({ name: 'currency' })
  @ApiProperty({ name: 'currency' })
  currency: string

  @Expose({ name: 'annualized_yield', toPlainOnly: true })
  @ApiProperty({ name: 'annualized_yield' })
  annualizedYield: string

  @Expose({ name: 'create_time', toPlainOnly: true })
  @ApiProperty({ name: 'create_time' })
  createTime: string

  @Expose({ name: 'end_time' })
  @ApiPropertyOptional({ name: 'end_time' })
  endTime?: string

  @Expose({ name: 'roi_percent', toPlainOnly: true })
  @ApiProperty({ name: 'roi_percent' })
  roiPercent: string

  @Expose({ name: 'float_profit', toPlainOnly: true })
  @ApiProperty({ name: 'float_profit' })
  floatProfit: string

  @Expose()
  @ApiProperty({ name: 'balances', type: [GrpcGridBalanceDto] })
  balances: GrpcGridBalanceDto[] = []
}

class OrderbookDto {
  @Expose({ name: 'amount' })
  @ApiProperty({ name: 'amount' })
  amount: string

  @Expose({ name: 'price' })
  @ApiProperty({ name: 'price' })
  price: string
}

export class GrpcGetOpenOrderResponse {
  @Expose({ name: 'asks' })
  @ApiProperty({ name: 'asks', type: [OrderbookDto] })
  asks: OrderbookDto[] = []

  @Expose({ name: 'bids' })
  @ApiProperty({ name: 'bids', type: [OrderbookDto] })
  bids: OrderbookDto[] = []

  @Expose({ name: 'quantity_per_order', toPlainOnly: true })
  @ApiProperty({ name: 'quantity_per_order' })
  quantityPerOrder: string
}

export class GrpcGetTradeHistorySummaryResponse {
  @Expose({ name: 'total_matched_trade', toPlainOnly: true })
  @ApiProperty({ name: 'total_matched_trade' })
  totalMatchedTrade: string

  @Expose({ name: 'start_price', toPlainOnly: true })
  @ApiProperty({ name: 'start_price' })
  startPrice: string

  @Expose({ name: 'initial_buy_quantity', toPlainOnly: true })
  @ApiProperty({ name: 'initial_buy_quantity' })
  initialBuyQuantity: string

  @Expose({ name: 'sell_quantity_at_stop', toPlainOnly: true })
  @ApiPropertyOptional({ name: 'sell_quantity_at_stop' })
  sellQuantityAtStop?: string

  @Expose({ name: 'average_sell_price_at_stop', toPlainOnly: true })
  @ApiPropertyOptional({ name: 'average_sell_price_at_stop' })
  averageSellPriceAtStop?: string

  @Expose({ name: 'stop_price', toPlainOnly: true })
  @ApiPropertyOptional({ name: 'stop_price' })
  stopPrice?: string

  @Expose({ name: 'grid_profit', toPlainOnly: true })
  @ApiProperty({ name: 'grid_profit' })
  gridProfit: string
}

class TradeHistoryOrderInfoDto {
  @Expose({ name: 'avg_price', toPlainOnly: true })
  @ApiProperty({ name: 'avg_price' })
  avgPrice: string

  @Expose({ name: 'total' })
  @ApiProperty({ name: 'total' })
  total: string

  @Expose({ name: 'order_class', toPlainOnly: true })
  @ApiProperty({ name: 'order_class' })
  orderClass: ORDER_CLASS

  @Expose({ name: 'side' })
  @ApiProperty({ name: 'side' })
  side: ORDER_TYPE

  @Expose({ name: 'total_currency', toPlainOnly: true })
  @ApiProperty({ name: 'total_currency' })
  totalCurrency: string

  @Expose({ name: 'filled_amount', toPlainOnly: true })
  @ApiProperty({ name: 'filled_amount' })
  filledAmount: string

  @Expose({ name: 'fee' })
  @ApiProperty({ name: 'fee' })
  fee: string

  @Expose({ name: 'fee_currency', toPlainOnly: true })
  @ApiProperty({ name: 'fee_currency' })
  feeCurrency: string

  @Expose({ name: 'create_time', toPlainOnly: true })
  @ApiProperty({ name: 'create_time', description: 'Time order created' })
  createTime: string
}

class TradeHistoryItemDto {
  @Expose({ name: 'trade_id', toPlainOnly: true })
  @ApiProperty({ name: 'trade_id' })
  tradeId: string

  @Expose({ name: 'strategy_id', toPlainOnly: true })
  @ApiProperty({ name: 'strategy_id' })
  strategyId: string

  @Expose({ name: 'create_time', toPlainOnly: true })
  @ApiProperty({ name: 'create_time' })
  createTime: string

  @Expose({ name: 'profit' })
  @ApiProperty({ name: 'profit' })
  profit: string

  @Expose({ name: 'profit_currency', toPlainOnly: true })
  @ApiProperty({ name: 'profit_currency' })
  profitCurrency: string

  @Expose({ name: 'buy' })
  @ApiProperty({
    name: 'buy',
    description: 'Buy order of trade',
    type: TradeHistoryOrderInfoDto,
  })
  @Type(() => TradeHistoryOrderInfoDto)
  @ValidateNested()
  buy: TradeHistoryOrderInfoDto

  @Expose({ name: 'sell' })
  @ApiProperty({
    name: 'sell',
    description: 'Sell order of trade',
    type: TradeHistoryOrderInfoDto,
  })
  @Type(() => TradeHistoryOrderInfoDto)
  @ValidateNested()
  sell: TradeHistoryOrderInfoDto
}

export class GrpcGetTradeHistoryResponse extends BasePaginationResponse<
  TradeHistoryItemDto[]
> {
  @Expose()
  @ApiProperty({ type: [TradeHistoryItemDto] })
  @Type(() => TradeHistoryItemDto)
  @ValidateNested({ each: true })
  data: TradeHistoryItemDto[]
}
