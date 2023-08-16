import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { DataPointItem } from './data-point.entity'

export class GetDataPointParams {
  @ApiProperty({ name: 'coin', required: true })
  @Expose({ name: 'coin' })
  coin: string

  @ApiProperty({ name: 'currency', required: true })
  @Expose({ name: 'currency' })
  currency: string

  @ApiProperty({ name: 'start_time', required: true })
  @Expose({ name: 'start_time' })
  startTime: string

  @ApiProperty({ name: 'end_time', required: true })
  @Expose({ name: 'end_time' })
  endTime: string
}

export class DataPointResponse {
  version: string
  data_point: DataPointItem[]
}

export class GetSettingsParams {
  @ApiProperty({ name: 'coin', required: true })
  @Expose({ name: 'coin' })
  coin: string

  @ApiProperty({ name: 'currency', required: true })
  @Expose({ name: 'currency' })
  currency: string
}

export class GetImportOrderStatusParams extends GetSettingsParams {}

export class BCEOrder {
  trade_type: string
  currency: string
  coin: string
  type: 'limit'
  quantity: string
  price: string
  user_id: string
}

export class BCEOpenOrder {
  id: string
  email: string
  trade_type: string
  currency: string
  coin: string
  type: 'limit'
  quantity: string
  price: string
  user_id: string
}

export class OrderInfor {
  key: string
  status: string
  side?: string
}
export class OrderPairProcess {
  inProcess: boolean
  createdBuyPercent: string
  createdBuyOrders: OrderInfor[]
  canceledBuyOrders: OrderInfor[]
  canceledBuyPercent: string
  createdSellPercent: string
  createdSellOrders: OrderInfor[]
  canceledSellOrders: OrderInfor[]
  canceledSellPercent: string
}

export class OrderProcessResponse {
  [pair: string]: OrderPairProcess
}
