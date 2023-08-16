import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  ApiCreateTradingModeDTO,
  ApiUpdateTradingModeDTO,
  ApiDeleteTradingModeDTO,
  ApiListTradingModeDTO,
  ApiFindOneTradingModeDTO,
  ApiUpdateStatusTradingModeDTO,
} from './trading-mode.dto'
import { TradingModeService } from './trading-mode.service'

@ApiTags('Trading Mode')
@Controller('bo/setting')
export class TradingModeController {
  constructor(private readonly boTradingModeService: TradingModeService) {}

  //Trading Mode
  @Get('/trading-modes/export')
  @CheckPermission(Permission.HIGH_LOW_TRADING_MODE_READ)
  @ApiBearerAuth('access-token')
  async export(@Query() filter: ApiListTradingModeDTO) {
    return await this.boTradingModeService.export(filter)
  }

  @Get('/trading-modes')
  @CheckPermission(Permission.HIGH_LOW_TRADING_MODE_READ)
  @ApiBearerAuth('access-token')
  async list(@Query() filter: ApiListTradingModeDTO) {
    return await this.boTradingModeService.list(filter)
  }

  @Post('/trading-modes')
  @CheckPermission(Permission.HIGH_LOW_TRADING_MODE_CREATE)
  @ApiBearerAuth('access-token')
  async create(@Body() apiCreateTradingModeDTO: ApiCreateTradingModeDTO) {
    return await this.boTradingModeService.create(apiCreateTradingModeDTO)
  }

  @Get('/trading-modes/:id')
  @CheckPermission(Permission.HIGH_LOW_TRADING_MODE_READ)
  @ApiBearerAuth('access-token')
  async findOne(@Param() findOneRequest: ApiFindOneTradingModeDTO) {
    return await this.boTradingModeService.findOne(findOneRequest)
  }

  @Patch('/trading-modes/:id')
  @CheckPermission(Permission.HIGH_LOW_TRADING_MODE_UPDATE)
  @ApiBearerAuth('access-token')
  async update(@Body() apiUpdateTradingModeDTO: ApiUpdateTradingModeDTO) {
    return await this.boTradingModeService.update(apiUpdateTradingModeDTO)
  }

  @Patch('/trading-modes-status/:id')
  @CheckPermission(Permission.HIGH_LOW_TRADING_MODE_UPDATE)
  @ApiBearerAuth('access-token')
  async updateStatus(
    @Body() apiUpdateStatusTradingModeDTO: ApiUpdateStatusTradingModeDTO,
  ) {
    return await this.boTradingModeService.updateStatus(
      apiUpdateStatusTradingModeDTO,
    )
  }

  @Delete('/trading-modes/:id')
  @CheckPermission(Permission.HIGH_LOW_TRADING_MODE_DELETE)
  @ApiBearerAuth('access-token')
  async delete(@Param() apiDeleteTradingModeDTO: ApiDeleteTradingModeDTO) {
    return await this.boTradingModeService.delete(apiDeleteTradingModeDTO)
  }

  @Get('/period')
  @CheckPermission(Permission.HIGH_LOW_TRADING_MODE_READ)
  @ApiBearerAuth('access-token')
  async getPeriod() {
    return await this.boTradingModeService.getPeriod()
  }
}
