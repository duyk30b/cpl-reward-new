import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import IExchangePriceService, {
  GetPricesResponse,
  PriceRequest,
} from 'libs/exchange/grpc-services/price/exchange-price.interface'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class ExchangePriceService {
  private exchangePriceService: IExchangePriceService

  constructor(@Inject('EXCHANGE_GRPC') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.exchangePriceService = this.clientGrpc.getService('PriceService')
  }

  async getPrice(data: PriceRequest): Promise<GetPricesResponse> {
    return await lastValueFrom(this.exchangePriceService.getPrice(data))
  }
}
