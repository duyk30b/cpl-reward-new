import { TransformRpcExceptionInterceptor } from '@app/common/transform-rpc-exception.interceptor'
import {
  CreateGridTradingSettingItemDto,
  DeleteGridTradingResponseDto,
  GetGridTradingPaginationDto,
  GridTradingSettingItemDto,
  GrpcGridTradingSettingPaginationResponse,
  GrpcListPairNameResponse,
  UpdateGridTradingSettingItemDto,
  UpdateOrderOfPairRequestDto,
  UpdateOrderOfPairResponse,
} from '@lib/grpc-client/grid-trading-setting/dtos'
import { GridTradingSettingService } from '@lib/grpc-client/grid-trading-setting/services/grid-trading.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { instanceToPlain } from 'class-transformer'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'

@ApiTags('Grid trading setting')
@Controller('api-grid-trading-setting')
@UseInterceptors(TransformRpcExceptionInterceptor)
export class ApiGridTradingSettingController {
  constructor(private readonly gridTradingService: GridTradingSettingService) {}

  //////// Pair ////////

  @Get()
  @CheckPermission(Permission.GRID_TRADING_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get pair settings by pagination' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcGridTradingSettingPaginationResponse })
  public async getGridTrading(@Query() query: GetGridTradingPaginationDto) {
    return instanceToPlain(
      await this.gridTradingService.getGridTradingByPagination(query),
    )
  }

  @Get('all-pair-name')
  @CheckPermission(Permission.GRID_TRADING_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all pair name' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcListPairNameResponse })
  public async getAllPairName() {
    return instanceToPlain(await this.gridTradingService.getAllPairName())
  }

  @Get('list')
  @CheckPermission(Permission.GRID_TRADING_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all grid trading' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [GridTradingSettingItemDto] })
  public async getListGridTrading() {
    return instanceToPlain(await this.gridTradingService.getGridTrading())
  }

  @Patch()
  @CheckPermission(Permission.GRID_TRADING_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Patch a grid trading' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GridTradingSettingItemDto })
  public async updateGridTrading(
    @Body()
    body: UpdateGridTradingSettingItemDto,
  ) {
    return await this.gridTradingService.setGridTrading(body)
  }

  @Post()
  @CheckPermission(Permission.GRID_TRADING_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a grid trading' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GridTradingSettingItemDto })
  public async createGridTrading(
    @Body() body: CreateGridTradingSettingItemDto,
  ) {
    return await this.gridTradingService.setGridTrading(body)
  }

  @Delete(':id')
  @CheckPermission(Permission.GRID_TRADING_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a grid trading' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: DeleteGridTradingResponseDto })
  public async deleteGridTrading(@Param('id') id: string) {
    return await this.gridTradingService.deleteGridTrading(id)
  }

  @Patch('order-pair')
  @CheckPermission(Permission.GRID_TRADING_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update order grid trading pair setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UpdateOrderOfPairResponse })
  public async updateOrderPair(
    @Body() updateOrderPair: UpdateOrderOfPairRequestDto,
  ) {
    return instanceToPlain(
      await this.gridTradingService.updateOrderOfPair(updateOrderPair),
    )
  }
}
