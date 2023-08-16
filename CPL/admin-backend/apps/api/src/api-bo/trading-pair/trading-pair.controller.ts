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
  ApiCreateTradingPairDTO,
  ApiUpdateStatusTradingPairDTO,
  ApiUpdateTradingPairDTO,
  DeleteTradingPairDTO,
  FindOneByIdDTO,
  ListTradingPairDTO,
} from './trading-pair.dto'
import { TradingPairService } from './trading-pair.service'

@ApiTags('BO TradingPair')
@Controller('bo/setting')
export class TradingPairController {
  constructor(private readonly apiTradingPairService: TradingPairService) {}

  @Post('/trading-pair')
  @CheckPermission(Permission.HIGH_LOW_TRADING_PAIR_CREATE)
  @ApiBearerAuth('access-token')
  async create(@Body() apiCreateTradingPairDTO: ApiCreateTradingPairDTO) {
    return await this.apiTradingPairService.create(apiCreateTradingPairDTO)
  }

  @Get('/trading-pair')
  @CheckPermission(Permission.HIGH_LOW_TRADING_PAIR_READ)
  //@ApiBearerAuth('access-token')
  async findAll(@Query() listTradingPairDTO: ListTradingPairDTO) {
    return await this.apiTradingPairService.findAll(listTradingPairDTO)
  }

  @Get('/trading-pair/:id')
  @CheckPermission(Permission.HIGH_LOW_TRADING_PAIR_READ)
  @ApiBearerAuth('access-token')
  async findOneById(@Param() findOneByIdDTO: FindOneByIdDTO) {
    return await this.apiTradingPairService.findOneById(findOneByIdDTO)
  }

  @Patch('/trading-pair/:id')
  @CheckPermission(Permission.HIGH_LOW_TRADING_PAIR_UPDATE)
  @ApiBearerAuth('access-token')
  async update(
    @Param('id') id: string,
    @Body() apiUpdateTradingPairDTO: ApiUpdateTradingPairDTO,
  ) {
    return await this.apiTradingPairService.update(+id, apiUpdateTradingPairDTO)
  }

  @Patch('/trading-pair-status/:id')
  @CheckPermission(Permission.HIGH_LOW_TRADING_PAIR_UPDATE)
  @ApiBearerAuth('access-token')
  async updateStatus(
    @Param('id') id: string,
    @Body() apiUpdateTradingPairDTO: ApiUpdateStatusTradingPairDTO,
  ) {
    return await this.apiTradingPairService.updateStatus(
      +id,
      apiUpdateTradingPairDTO,
    )
  }

  @Delete('/trading-pair/:id')
  @CheckPermission(Permission.HIGH_LOW_TRADING_PAIR_DELETE)
  @ApiBearerAuth('access-token')
  async delete(@Param() deleteDTO: DeleteTradingPairDTO) {
    return await this.apiTradingPairService.delete(deleteDTO)
  }
}
