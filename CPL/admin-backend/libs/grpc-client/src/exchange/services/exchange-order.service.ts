import { AdminService } from '@lib/admin'
import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { catchError, lastValueFrom, map, tap } from 'rxjs'
import { Constants } from '../constants'
import {
  CancelOrderByIdsResponseDto,
  CancelOrderByUserIdRequestDto,
  CancelOrderRequestDto,
} from '../dtos/cancel-order.dto'
import {
  CreateOrderRequestDto,
  CreateOrderResponse,
} from '../dtos/create-order.dto'
import {
  ExportTradeHistoryRequestDto,
  GetListTradeHistoryQueryDto,
  GrpcExportTradeHistoryResponse,
  GrpcTradeHistoryPaginationResponse,
} from '../dtos/get-list-trade-history.dto'
import {
  ListOpenOrderRequest,
  ListOpenOrderResponse,
} from '../dtos/list-open-order.dto'
import {
  ExportOpenOrderRequestDto,
  GetOpenOrderQueryDto,
  GrpcExportOpenOrderResponse,
  GrpcOpenOrderPaginationResponse,
} from '../dtos/open-order.dto'
import {
  GetOrderHistoryQueryDto,
  GrpcOrderHistoryPaginationResponse,
} from '../dtos/order-history.dto'
import {
  GetOrderbookQueryDto,
  OrderbookResponseDto,
} from '../dtos/orderbook.dto'
import { IExchangeOrder } from '../interfaces/order.interface'
import { IExchangeOrderbook } from '../interfaces/orderbook.interface'

@Injectable()
export class ExchangeOrderService implements OnModuleInit {
  private readonly logger = new Logger(ExchangeOrderService.name)
  private exchangeOrderService: IExchangeOrder
  private exchangeOrderbookService: IExchangeOrderbook

  constructor(
    @Inject(Constants.GRPC_EX_ORDER_TOKEN)
    private readonly clientGrpc: ClientGrpc,
    @Inject(Constants.GRPC_EX_ORDERBOOK_TOKEN)
    private readonly orderbookClient: ClientGrpc,

    private readonly adminService: AdminService,
  ) {}
  onModuleInit() {
    this.exchangeOrderService = this.clientGrpc.getService(
      Constants.GRPC_EX_ORDER_SERVICE,
    )
    this.exchangeOrderbookService = this.orderbookClient.getService(
      Constants.GRPC_EX_ORDERBOOK_SERVICE,
    )
  }

  public async getListOrderHistory(
    queryDto: GetOrderHistoryQueryDto,
  ): Promise<GrpcOrderHistoryPaginationResponse> {
    return lastValueFrom(
      this.exchangeOrderService.getOrderHistory(queryDto).pipe(
        map((response) =>
          plainToInstance(GrpcOrderHistoryPaginationResponse, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async getListOpenOrder(
    queryDto: GetOpenOrderQueryDto,
  ): Promise<GrpcOpenOrderPaginationResponse> {
    return lastValueFrom(
      this.exchangeOrderService.getOpenOrder(queryDto).pipe(
        map((response) =>
          plainToInstance(GrpcOpenOrderPaginationResponse, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async exportOpenOrder(
    queryDto: GetOpenOrderQueryDto,
    userId: string,
  ): Promise<GrpcExportOpenOrderResponse> {
    const admin = await this.adminService.getAdminById(userId)
    if (!admin) {
      throw new UnauthorizedException()
    }
    return lastValueFrom(
      this.exchangeOrderService
        .exportOpenOrder(
          plainToInstance(ExportOpenOrderRequestDto, {
            ...instanceToPlain(queryDto),
            email: admin.email,
          }),
        )
        .pipe(
          tap(() => {
            this.logger.log('Send request export open order successfully')
          }),
          map((response) =>
            plainToInstance(GrpcExportOpenOrderResponse, response, {
              exposeDefaultValues: true,
            }),
          ),
          catchError((error) => {
            this.logger.error('Export open order failed', { error })
            throw error
          }),
        ),
    )
  }

  public async cancelOrderByIds(
    body: CancelOrderRequestDto,
  ): Promise<CancelOrderByIdsResponseDto> {
    return lastValueFrom(
      this.exchangeOrderService.cancelOrderByIds(body).pipe(
        map((response) =>
          plainToInstance(CancelOrderByIdsResponseDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }
  public async cancelOrderByUserId(
    body: CancelOrderByUserIdRequestDto,
  ): Promise<CancelOrderByIdsResponseDto> {
    return lastValueFrom(
      this.exchangeOrderService.cancelOrderByUserId(body).pipe(
        map((response) =>
          plainToInstance(CancelOrderByIdsResponseDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async getListTradeHistory(
    queryDto: GetListTradeHistoryQueryDto,
  ): Promise<GrpcTradeHistoryPaginationResponse> {
    return lastValueFrom(
      this.exchangeOrderService.getTradeHistory(queryDto).pipe(
        map((response) =>
          plainToInstance(GrpcTradeHistoryPaginationResponse, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async exportTradeHistory(
    queryDto: GetListTradeHistoryQueryDto,
    userId: string,
  ): Promise<GrpcExportTradeHistoryResponse> {
    const admin = await this.adminService.getAdminById(userId)
    if (!admin) {
      throw new UnauthorizedException()
    }
    return lastValueFrom(
      this.exchangeOrderService
        .exportTradeHistory(
          plainToInstance(ExportTradeHistoryRequestDto, {
            ...instanceToPlain(queryDto),
            email: admin.email,
          }),
        )
        .pipe(
          tap(() => {
            this.logger.log('Send request export trade history successfully')
          }),
          map((response) =>
            plainToInstance(GrpcExportTradeHistoryResponse, response, {
              exposeDefaultValues: true,
            }),
          ),
          catchError((error) => {
            this.logger.error('Export trade history failed', { error })
            throw error
          }),
        ),
    )
  }

  public async getOrderbook(
    queryDto: GetOrderbookQueryDto,
  ): Promise<OrderbookResponseDto> {
    return lastValueFrom(
      this.exchangeOrderbookService.getOrderbook(queryDto).pipe(
        map((response) =>
          plainToInstance(OrderbookResponseDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async createOrder(
    body: CreateOrderRequestDto,
  ): Promise<CreateOrderResponse> {
    return lastValueFrom(
      this.exchangeOrderService.createOrder(body).pipe(
        map((response) =>
          plainToInstance(CreateOrderResponse, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async getListOrderByUser(
    queryDto: ListOpenOrderRequest,
  ): Promise<ListOpenOrderResponse> {
    return lastValueFrom(
      this.exchangeOrderService.getListOrderByUserId(queryDto).pipe(
        map((response) =>
          plainToInstance(ListOpenOrderResponse, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }
}
