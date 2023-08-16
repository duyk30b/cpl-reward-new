import { TransformRpcExceptionInterceptor } from '@app/common/transform-rpc-exception.interceptor'
import {
  GetGridTradingRequestDto,
  GrpcGetGridDetailRequestDto,
  GrpcGetTradeHistoryRequestDto,
  GrpcGetTradeHistorySummaryRequestDto,
  GrpcOpenOrderRequestDto,
} from '@lib/grpc-client/grid-trading/dtos/grid-trading-input.dto'
import {
  GrpcGetOpenOrderResponse,
  GrpcGetTradeHistoryResponse,
  GrpcGetTradeHistorySummaryResponse,
  GrpcGridTradingResponse,
  GrpcStrategyDetailResponse,
} from '@lib/grpc-client/grid-trading/dtos/grpc-grid-trading.dto'
import { GridTradingService } from '@lib/grpc-client/grid-trading/grid-trading.service'
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'

@ApiTags('Grid trading')
@Controller('api-grid-trading')
@UseInterceptors(TransformRpcExceptionInterceptor)
export class ApiGridTradingController {
  constructor(private readonly gridTradingService: GridTradingService) {}

  //////// Grid Trading ////////

  @Get()
  @CheckPermission(Permission.GRID_TRADING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list grid trading by pagination' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGridTradingResponse })
  public async getGridTrading(@Query() query: GetGridTradingRequestDto) {
    return instanceToPlain(
      await this.gridTradingService.getGridTrading(
        plainToInstance(GetGridTradingRequestDto, instanceToPlain(query), {
          exposeDefaultValues: true,
        }),
      ),
    )
  }

  @Get('open-order/:id')
  @CheckPermission(Permission.GRID_TRADING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get open order of strategy' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetOpenOrderResponse })
  public async getOpenOrder(@Param('id') strategyId: string) {
    return instanceToPlain(
      await this.gridTradingService.getOpenOrder(
        plainToInstance(GrpcOpenOrderRequestDto, {
          strategy_id: strategyId,
        }),
      ),
    )
  }

  @Get('detail')
  @CheckPermission(Permission.GRID_TRADING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get strategy detail' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcStrategyDetailResponse })
  public async getStrategyDetail(@Query() query: GrpcGetGridDetailRequestDto) {
    return instanceToPlain(
      await this.gridTradingService.getStrategyDetail(
        plainToInstance(GrpcGetGridDetailRequestDto, instanceToPlain(query), {
          exposeDefaultValues: true,
        }),
      ),
    )
  }

  @Get('trade-history-summary')
  @CheckPermission(Permission.GRID_TRADING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get trade history summary' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetTradeHistorySummaryResponse })
  public async getTradeHistorySummary(
    @Query() query: GrpcGetTradeHistorySummaryRequestDto,
  ) {
    return instanceToPlain(
      await this.gridTradingService.getTradeHistorySummary(
        plainToInstance(
          GrpcGetTradeHistorySummaryRequestDto,
          instanceToPlain(query),
          {
            exposeDefaultValues: true,
          },
        ),
      ),
    )
  }

  @Get('trade-history')
  @CheckPermission(Permission.GRID_TRADING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get trade history' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGetTradeHistoryResponse })
  public async getTradeHistory(@Query() query: GrpcGetTradeHistoryRequestDto) {
    return instanceToPlain(
      await this.gridTradingService.getTradeHistory(
        plainToInstance(GrpcGetTradeHistoryRequestDto, instanceToPlain(query), {
          exposeDefaultValues: true,
        }),
      ),
    )
  }
}
