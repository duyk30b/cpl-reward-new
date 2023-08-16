import { Expose } from 'class-transformer'
import { ACTIVE_COPY, GRID_TYPE, STRATEGY_STATUS } from './enum'

export class GetGridDetailRequestDto {
  @Expose({ name: 'strategy_id' })
  strategyId: string

  @Expose({ name: 'user_id' })
  userId: string
}

export class GrpcGridBalanceDto {
  @Expose()
  currency: string

  @Expose()
  amount: string
}

export class GetStrategyDetailResponse {
  @Expose({ name: 'id' })
  id: string

  @Expose({ name: 'status' })
  status: STRATEGY_STATUS

  @Expose({ name: 'mode' })
  mode: GRID_TYPE

  @Expose({ name: 'lower_price' })
  lowerPrice: string

  @Expose({ name: 'higher_price' })
  higherPrice: string

  @Expose({ name: 'grid_number' })
  gridNumber: number

  @Expose({ name: 'lower_profit_per_grid' })
  lowerProfitPerGrid: string

  @Expose({ name: 'higher_profit_per_grid' })
  higherProfitPerGrid: string

  @Expose({ name: 'start_price' })
  startPrice: string

  @Expose({ name: 'stop_price' })
  stopPrice?: string

  @Expose({ name: 'trigger_price' })
  triggerPrice?: string

  @Expose({ name: 'take_profit_point' })
  takeProfitPoint?: string

  @Expose({ name: 'stop_loss_point' })
  stopLossPoint?: string

  @Expose({ name: 'copiers' })
  copiers: number

  @Expose({ name: 'active_copy' })
  activeCopy: ACTIVE_COPY

  @Expose({ name: 'start_time' })
  startTime?: string

  @Expose({ name: 'grid_profit' })
  gridProfit: string

  @Expose({ name: 'total_profit' })
  totalProfit: string

  @Expose({ name: 'total_investment' })
  totalInvestment: string

  @Expose({ name: 'coin' })
  coin: string

  @Expose({ name: 'currency' })
  currency: string

  @Expose({ name: 'annualized_yield' })
  annualizedYield: string

  @Expose({ name: 'create_time' })
  createTime: string

  @Expose({ name: 'end_time' })
  endTime?: string

  @Expose({ name: 'roi_percent' })
  roiPercent: string

  @Expose({ name: 'float_profit' })
  floatProfit: string

  @Expose()
  balances: GrpcGridBalanceDto[] = []
}
