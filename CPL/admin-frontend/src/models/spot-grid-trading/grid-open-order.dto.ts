import { Expose } from 'class-transformer'

export class OrderbookDto {
  @Expose()
  amount: string

  @Expose()
  price: string
}

export class GetOpenOrderResponse {
  @Expose()
  asks: OrderbookDto[] = []

  @Expose()
  bids: OrderbookDto[] = []

  @Expose({ name: 'quantity_per_order' })
  quantityPerOrder: string
}
