import { TransformRpcExceptionInterceptor } from '@app/common/transform-rpc-exception.interceptor'
import { IAccessTokenPayload } from '@lib/authorization/interfaces/access-token-payload.interface'
import {
  CancelOrderByIdsResponseDto,
  CancelOrderRequestDto,
} from '@lib/grpc-client/exchange/dtos/cancel-order.dto'
import {
  GetListTradeHistoryQueryDto,
  GrpcExportTradeHistoryResponse,
  GrpcTradeHistoryPaginationResponse,
} from '@lib/grpc-client/exchange/dtos/get-list-trade-history.dto'
import {
  GetOpenOrderQueryDto,
  GrpcExportOpenOrderResponse,
  GrpcOpenOrderPaginationResponse,
} from '@lib/grpc-client/exchange/dtos/open-order.dto'
import {
  GetOrderHistoryQueryDto,
  GrpcOrderHistoryPaginationResponse,
} from '@lib/grpc-client/exchange/dtos/order-history.dto'
import {
  GetOrderbookQueryDto,
  OrderbookResponseDto,
} from '@lib/grpc-client/exchange/dtos/orderbook.dto'
import {
  CreateUserBlackListRequestDto,
  GetUserBlackListQuery,
  GrpcUserBlackListPaginationResponse,
  RemoveFromBlackListRequestDto,
  RemoveFromBlackListResponseDto,
  UpdateUserBlackListRequestDto,
  UserBlackListDto,
} from '@lib/grpc-client/exchange/dtos/user-black-list.dto'
import {
  CreateUserUnlimitedRequestDto,
  GetUserUnlimitedQuery,
  GrpcUserUnlimitedPaginationResponse,
  RemoveFromUnlimitedRequestDto,
  RemoveFromUnlimitedResponseDto,
  UpdateUserUnlimitedRequestDto,
  UserUnlimitedDto,
} from '@lib/grpc-client/exchange/dtos/user-unlimited.dto'
import {
  GetUserZeroFeeQuery,
  GrpcUserZeroFeePaginationResponse,
  UpdateUserZeroFeeRequestDto,
  UpdateUserZeroFeeResponseDto,
} from '@lib/grpc-client/exchange/dtos/user-zero-fee.dto'
import { ExchangeUserBlackListService } from '@lib/grpc-client/exchange/services/exchange-black-list.service'
import { ExchangeOrderService } from '@lib/grpc-client/exchange/services/exchange-order.service'
import { ExchangeUserUnlimitedService } from '@lib/grpc-client/exchange/services/exchange-user-unlimited.service'
import { ExchangeUserZeroFeeService } from '@lib/grpc-client/exchange/services/exchange-user-zero-fee.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { TokenInformation } from '../decorators/current-user.decorator'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'

@ApiTags('Exchange')
@Controller('api-exchange')
@UseInterceptors(TransformRpcExceptionInterceptor)
export class ApiExchangeController {
  private readonly logger = new Logger(ApiExchangeController.name)
  constructor(
    private readonly exchangeOrderService: ExchangeOrderService,
    private readonly exchangeBlackListService: ExchangeUserBlackListService,
    private readonly exchangeUserUnlimitedService: ExchangeUserUnlimitedService,
    private readonly exchangeUserZeroFeeService: ExchangeUserZeroFeeService,
  ) {}

  @Get('/order-history')
  @CheckPermission(Permission.EXCHANGE_ORDER_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list order history' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcOrderHistoryPaginationResponse })
  public async getListOrderHistory(
    @Query() queryDto: GetOrderHistoryQueryDto,
  ): Promise<Record<string, any>> {
    return instanceToPlain(
      await this.exchangeOrderService.getListOrderHistory(
        plainToInstance(GetOrderHistoryQueryDto, queryDto, {
          exposeDefaultValues: true,
        }),
      ),
    )
  }

  @Get('/order')
  @CheckPermission(Permission.EXCHANGE_ORDER_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list open order' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcOpenOrderPaginationResponse })
  public async getListOpenOrder(
    @Query() queryDto: GetOpenOrderQueryDto,
  ): Promise<Record<string, any>> {
    return instanceToPlain(
      await this.exchangeOrderService.getListOpenOrder(
        plainToInstance(GetOpenOrderQueryDto, queryDto, {
          exposeDefaultValues: true,
        }),
      ),
    )
  }

  @Get('/export-open-order')
  @CheckPermission(Permission.EXCHANGE_ORDER_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Export open order' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcExportOpenOrderResponse })
  public async exportOpenOrder(
    @TokenInformation() token: IAccessTokenPayload,
    @Query() queryDto: GetOpenOrderQueryDto,
  ): Promise<Record<string, any>> {
    return instanceToPlain(
      await this.exchangeOrderService.exportOpenOrder(
        plainToInstance(GetOpenOrderQueryDto, queryDto, {
          exposeDefaultValues: true,
        }),
        token.uid,
      ),
    )
  }

  @Post('/order/cancel')
  @CheckPermission(Permission.EXCHANGE_ORDER_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cancel multiple orders by id' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: CancelOrderByIdsResponseDto })
  public async cancelOrderByIds(
    @TokenInformation() token: IAccessTokenPayload,
    @Body() body: CancelOrderRequestDto,
  ): Promise<Record<string, any>> {
    this.logger.log(`Cancel order ids with body ${JSON.stringify(body)}`)
    body.cancellerId = token.uid
    return instanceToPlain(
      await this.exchangeOrderService.cancelOrderByIds(body),
    )
  }

  @Get('/trade-history')
  @CheckPermission(Permission.EXCHANGE_ORDER_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list trade history' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcTradeHistoryPaginationResponse })
  public async getListTradeHistory(
    @Query() queryDto: GetListTradeHistoryQueryDto,
  ): Promise<Record<string, any>> {
    return instanceToPlain(
      await this.exchangeOrderService.getListTradeHistory(queryDto),
    )
  }

  @Get('/export-trade-history')
  @CheckPermission(Permission.EXCHANGE_ORDER_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Export trade history' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcExportTradeHistoryResponse })
  public async exportTradeHistory(
    @TokenInformation() token: IAccessTokenPayload,
    @Query() queryDto: GetListTradeHistoryQueryDto,
  ): Promise<Record<string, any>> {
    return instanceToPlain(
      await this.exchangeOrderService.exportTradeHistory(queryDto, token.uid),
    )
  }

  @Get('/orderbook')
  @CheckPermission(Permission.EXCHANGE_ORDER_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get orderbook' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: OrderbookResponseDto })
  public async getOrderbook(
    @Query() queryDto: GetOrderbookQueryDto,
  ): Promise<Record<string, any>> {
    this.logger.log(`Get orderbook with params: ${JSON.stringify(queryDto)}`)
    return instanceToPlain(
      await this.exchangeOrderService.getOrderbook(queryDto),
    )
  }

  @Get('/black-list')
  @CheckPermission(Permission.EXCHANGE_USER_BLACK_LIST_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user black list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUserBlackListPaginationResponse })
  public async getUserBlackList(
    @Query() queryDto: GetUserBlackListQuery,
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Get user black list with params: ${JSON.stringify(queryDto)}`,
    )
    return instanceToPlain(
      await this.exchangeBlackListService.getUserBlackList(queryDto),
    )
  }

  @Post('/black-list')
  @CheckPermission(Permission.EXCHANGE_USER_BLACK_LIST_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add user black list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserBlackListDto })
  public async addUserBlackList(
    @TokenInformation() token: IAccessTokenPayload,
    @Body() body: CreateUserBlackListRequestDto,
  ): Promise<Record<string, any>> {
    this.logger.log(`Add user black list with params: ${JSON.stringify(body)}`)
    return instanceToPlain(
      await this.exchangeBlackListService.addUserBlackList(body, token.uid),
    )
  }

  @Patch('/black-list')
  @CheckPermission(Permission.EXCHANGE_USER_BLACK_LIST_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user black list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserBlackListDto })
  public async updateUserBlackList(
    @Body() body: UpdateUserBlackListRequestDto,
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Update user black list with params: ${JSON.stringify(body)}`,
    )
    return instanceToPlain(
      await this.exchangeBlackListService.updateUserBlackList(body),
    )
  }

  @Delete('/black-list')
  @CheckPermission(Permission.EXCHANGE_USER_BLACK_LIST_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add user black list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: RemoveFromBlackListResponseDto })
  public async removeUserBlackList(
    @Query() query: RemoveFromBlackListRequestDto,
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Remove user from black list with params: ${JSON.stringify(query)}`,
    )
    return instanceToPlain(
      await this.exchangeBlackListService.removeUserBlackList(query),
    )
  }

  @Get('/user-unlimited')
  @CheckPermission(Permission.EXCHANGE_USER_UNLIMITED_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list user unlimited' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUserUnlimitedPaginationResponse })
  public async getListUserUnlimited(
    @Query() queryDto: GetUserUnlimitedQuery,
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Get user unlimited with params: ${JSON.stringify(queryDto)}`,
    )
    return instanceToPlain(
      await this.exchangeUserUnlimitedService.getUserUnlimited(queryDto),
    )
  }

  @Post('/user-unlimited')
  @CheckPermission(Permission.EXCHANGE_USER_UNLIMITED_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add user unlimited' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserUnlimitedDto })
  public async addUserUnlimited(
    @Body() body: CreateUserUnlimitedRequestDto,
  ): Promise<Record<string, any>> {
    this.logger.log(`Add user unlimited with params: ${JSON.stringify(body)}`)
    return instanceToPlain(
      await this.exchangeUserUnlimitedService.addUserUnlimited(body),
    )
  }

  @Patch('/user-unlimited')
  @CheckPermission(Permission.EXCHANGE_USER_UNLIMITED_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user unlimited' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserUnlimitedDto })
  public async updateUserUnlimited(
    @Body() body: UpdateUserUnlimitedRequestDto,
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Update user unlimited with params: ${JSON.stringify(body)}`,
    )
    return instanceToPlain(
      await this.exchangeUserUnlimitedService.updateUserUnlimited(body),
    )
  }

  @Delete('/user-unlimited')
  @CheckPermission(Permission.EXCHANGE_USER_UNLIMITED_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add user unlimited' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: RemoveFromUnlimitedResponseDto })
  public async removeUserUnlimited(
    @Query() query: RemoveFromUnlimitedRequestDto,
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Remove user from user unlimited with params: ${JSON.stringify(query)}`,
    )
    return instanceToPlain(
      await this.exchangeUserUnlimitedService.removeUserUnlimited(query),
    )
  }

  @Get('/user-zero-fee')
  @CheckPermission(Permission.EXCHANGE_USER_ZERO_FEE_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list user zero fee' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcUserZeroFeePaginationResponse })
  public async getListUserZeroFee(
    @Query() queryDto: GetUserZeroFeeQuery,
  ): Promise<Record<string, any>> {
    this.logger.log(
      `Get user zero fee with params: ${JSON.stringify(queryDto)}`,
    )
    return instanceToPlain(
      await this.exchangeUserZeroFeeService.getUserZeroFee(queryDto),
    )
  }

  @Patch('/user-zero-fee')
  @CheckPermission(Permission.EXCHANGE_USER_ZERO_FEE_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user zero fee' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UpdateUserZeroFeeResponseDto })
  public async updateUserZeroFee(
    @Body() body: UpdateUserZeroFeeRequestDto,
  ): Promise<Record<string, any>> {
    this.logger.log(`Update user zero fee with params: ${JSON.stringify(body)}`)
    return instanceToPlain(
      await this.exchangeUserZeroFeeService.updateUserZeroFee(body),
    )
  }
}
