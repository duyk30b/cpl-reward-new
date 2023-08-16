import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiFuturesService } from './api-futures.service'
import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'
import { plainToInstance } from 'class-transformer'
import { OpenPositionResponse } from './api-futures.dto'
import { InvisibleInProdGuard } from './invisible-in-prod.guard'
import {
  FuturesSetting,
  IGetFuturesSettingDto,
  IUpdateStatusDto,
  ODeleteSettingResponse,
  OUpdateSettingResponse,
} from '@lib/grpc-client/common-setting/futures-setting/futures-setting.dto'
import {
  CancelOrderRequest,
  CancelOrderResponse,
  OrderData,
  SearchOrderRequest,
} from '@lib/grpc-client/futures/integrate/futures-integrate.dto'
import { GetPositionListRequest } from '@lib/grpc-client/futures/core/futures-core.dto'

@ApiTags('Api futures')
@Controller('api-futures')
export class ApiFuturesController {
  constructor(private readonly apiFutureService: ApiFuturesService) {}

  @Get('/open-order')
  @CheckPermission(Permission.FUTURES_ORDER_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list open order' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: OrderData })
  @UseGuards(InvisibleInProdGuard)
  public async getListOpenOrder(
    @Query() searchOrderRequest: SearchOrderRequest,
  ): Promise<OrderData> {
    return await this.apiFutureService.getListOpenOrder(
      plainToInstance(SearchOrderRequest, searchOrderRequest, {
        exposeDefaultValues: true,
      }),
    )
  }

  @Post('/open-order/cancel')
  @CheckPermission(Permission.FUTURES_ORDER_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cancel multiple orders by id' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: CancelOrderResponse })
  @UseGuards(InvisibleInProdGuard)
  public async cancelOrderByIds(
    @Body() body: CancelOrderRequest,
  ): Promise<CancelOrderResponse> {
    return this.apiFutureService.cancelOrderByIds(body)
  }

  @Get('/order-history')
  @CheckPermission(Permission.FUTURES_ORDER_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list order history' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: OrderData })
  @UseGuards(InvisibleInProdGuard)
  public async getListOrderHistory(
    @Query() searchOrderRequest: SearchOrderRequest,
  ): Promise<OrderData> {
    return await this.apiFutureService.getListOrderHistory(
      plainToInstance(SearchOrderRequest, searchOrderRequest, {
        exposeDefaultValues: true,
      }),
    )
  }

  @Get('/open-position')
  @CheckPermission(Permission.FUTURES_OPEN_POSITION_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list open position' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GetPositionListRequest })
  @UseGuards(InvisibleInProdGuard)
  public async getListOpenPosition(
    @Query() getPositionListRequest: GetPositionListRequest,
  ): Promise<OpenPositionResponse> {
    return await this.apiFutureService.getListOpenPosition(
      plainToInstance(GetPositionListRequest, getPositionListRequest, {
        exposeDefaultValues: true,
      }),
    )
  }

  @Get('/get-settings')
  @CheckPermission(Permission.FUTURES_SETTINGS_LIST)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list future settings' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [FuturesSetting] })
  @UseGuards(InvisibleInProdGuard)
  public async getSettings(
    @Query() queryDto: IGetFuturesSettingDto,
  ): Promise<FuturesSetting[]> {
    return await this.apiFutureService.getSettings(queryDto)
  }

  @Get('/get-setting/:coin/:currency')
  @CheckPermission(Permission.FUTURES_SETTINGS_LIST)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get future setting by coin and currency' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: FuturesSetting })
  @UseGuards(InvisibleInProdGuard)
  public async getSingleSetting(
    @Param('coin') coin: string,
    @Param('currency') currency: string,
  ): Promise<FuturesSetting> {
    return await this.apiFutureService.getSingleSetting({ coin, currency })
  }

  @Post('/setup-setting')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.FUTURES_SETTINGS_LIST)
  @ApiOperation({ summary: 'Set future setting' })
  @ApiOkResponse({ type: FuturesSetting })
  async setupFutureSetting(
    @Body() futureSetting: FuturesSetting,
  ): Promise<FuturesSetting> {
    return this.apiFutureService.createSetting(futureSetting)
  }

  @Delete('/delete-setting/:coin/:currency')
  @CheckPermission(Permission.FUTURES_SETTINGS_LIST)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a pair' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ODeleteSettingResponse })
  public async deletePairSetting(
    @Param('coin') coin: string,
    @Param('currency') currency: string,
  ) {
    return await this.apiFutureService.deleteSetting({ coin, currency })
  }

  @Post('/update-status-all-pairs')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.FUTURES_SETTINGS_LIST)
  @ApiOperation({ summary: 'Set future setting' })
  @ApiOkResponse({ type: FuturesSetting })
  async updateStatusAllPairs(
    @Body() updateStatusDto: IUpdateStatusDto,
  ): Promise<OUpdateSettingResponse> {
    return this.apiFutureService.updateStatusPairs(updateStatusDto)
  }
}
