import { Observable } from 'rxjs'

export default interface IExchangePriceService {
  getPrice(request: PriceRequest): Observable<GetPricesResponse>
  getPriceHistory(
    request: GetPriceHistoryRequest,
  ): Observable<GetPriceHistoryResponse>
}
export interface PriceRequest {
  pairs: string[]
}
export interface PriceItem {
  coin: string
  currency: string
  price: string
}
export interface GetPricesResponse {
  data: PriceItem[]
  last_update: string
}
export interface GetPriceHistoryRequest {
  coin: string
  currency: string
  from: string
  to: string
}
export interface GetPriceHistoryResponse {
  data: GetPriceHistoryItem[]
  last_update: string
}
export interface GetPriceHistoryItem {
  time: string
  close: string
}
