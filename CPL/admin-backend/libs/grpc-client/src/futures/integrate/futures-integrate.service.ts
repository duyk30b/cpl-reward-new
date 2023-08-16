import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { FuturesIntegrate } from './futures-integrate.interface'
import { FuturesConstant } from '../futures.constant'
import { lastValueFrom, map } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import {
  CancelOrderRequest,
  CancelOrderResponse,
  OrderData,
  SearchOrderRequest,
} from './futures-integrate.dto'
@Injectable()
export class FuturesIntegrateService implements OnModuleInit {
  private futuresIntegrate: FuturesIntegrate

  constructor(
    @Inject(FuturesConstant.GRPC_FUTURES_INTEGRATE_TOKEN)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.futuresIntegrate = this.client.getService<FuturesIntegrate>(
      FuturesConstant.GRPC_FUTURES_INTEGRATE_SERVICE,
    )
  }

  public getList(request: SearchOrderRequest): Promise<OrderData> {
    return lastValueFrom(
      this.futuresIntegrate.getList(request).pipe(
        map((result) =>
          plainToInstance(OrderData, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public cancelOrder(
    request: CancelOrderRequest,
  ): Promise<CancelOrderResponse> {
    return lastValueFrom(
      this.futuresIntegrate.cancelOrder(request).pipe(
        map((result) =>
          plainToInstance(CancelOrderResponse, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public cancelAllOrder(): Promise<CancelOrderResponse> {
    return lastValueFrom(
      this.futuresIntegrate.cancelAllOrder().pipe(
        map((result) =>
          plainToInstance(CancelOrderResponse, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public getListOrderHistories(
    request: SearchOrderRequest,
  ): Promise<OrderData> {
    return lastValueFrom(
      this.futuresIntegrate.getListOrderHistories(request).pipe(
        map((result) =>
          plainToInstance(OrderData, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }
}
