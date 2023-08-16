import {
  Body,
  Query,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  Patch,
  Req,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { ListBalanceConvertSmallRequest } from '@lib/grpc-client/balance-convert-small/balance-convert-small.dto'
import { ApiBalanceConvertSmallService } from './api-balance-convert-small.service'

@ApiBearerAuth('access-token')
@ApiTags('Balance Convert Small')
@Controller('convert-small')
export class ApiBalanceConvertSmallController {
  constructor(
    private balanceConvertSmallService: ApiBalanceConvertSmallService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list balance convert small of users' })
  @CheckPermission(Permission.BALANCE_CONVERT_SMALL_HISTORY)
  async listBalanceConvertSmall(
    @Query() params: ListBalanceConvertSmallRequest,
  ) {
    return this.balanceConvertSmallService.listBalanceConvertSmall(params)
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all balance convert small history of users' })
  @CheckPermission(Permission.BALANCE_CONVERT_SMALL_HISTORY)
  async getAllBalanceConvertSmall(
    @Query() params: ListBalanceConvertSmallRequest,
  ) {
    return this.balanceConvertSmallService.getAllBalanceConvertSmall(params)
  }

  @Get('get-detail-by-ids')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get detail balance convert small by ids' })
  async detailBalanceConvertSmallByIds(@Query('ids') ids: string[]) {
    return this.balanceConvertSmallService.detailBalanceConvertSmallByIds(ids)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get detail balance convert small' })
  async detailBalanceConvertSmall(@Param('id') id: string) {
    return this.balanceConvertSmallService.detailBalanceConvertSmall(id)
  }
}
