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
import {
  ListBalanceConvertRequest,
  ListBalanceConvertLogRequest,
  CreateBalanceConvertRequest,
  UpdateBalanceConvertRequest,
} from '@lib/grpc-client/balance-convert/balance-convert.dto'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { ApiBalanceConvertService } from './api-balance-convert.service'

@ApiBearerAuth('access-token')
@ApiTags('Balance Convert')
@Controller('balance-convert-setting')
export class ApiBalanceConvertController {
  constructor(private balanceConvertService: ApiBalanceConvertService) {}

  @Get()
  @CheckPermission(Permission.BALANCE_CONVERT_SETTING_GET_LIST)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get balance convert setting' })
  async getAllBalanceConvert(@Query() params: ListBalanceConvertRequest) {
    return this.balanceConvertService.listBalanceConvert(params)
  }

  @Get('logs')
  @CheckPermission(Permission.BALANCE_CONVERT_SETTING_GET_LOGS)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get balance convert setting logs' })
  async getBalanceConvertLog(@Query() params: ListBalanceConvertLogRequest) {
    return this.balanceConvertService.listBalanceConvertLog(params)
  }

  @Get('/:id')
  @CheckPermission(Permission.BALANCE_CONVERT_SETTING_GET_DETAIL)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get detail balance convert setting' })
  async getDetailBalanceConvert(@Param('id') id: string) {
    return this.balanceConvertService.getBalanceConvert(id)
  }

  @Post()
  @CheckPermission(Permission.BALANCE_CONVERT_SETTING_CREATE)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create balance convert setting' })
  async createBalanceConvert(
    @Body() body: CreateBalanceConvertRequest,
    @Req() { accessTokenInfo }: IRequestWithAccessToken,
  ) {
    const balanceConvert = {
      ...body,
      configBy: accessTokenInfo.uid,
    }
    return this.balanceConvertService.createBalanceConvert(balanceConvert)
  }

  @Patch('/:id')
  @CheckPermission(Permission.BALANCE_CONVERT_SETTING_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update balance convert setting' })
  async updateBalanceConvert(
    @Body() body: UpdateBalanceConvertRequest,
    @Req() { accessTokenInfo }: IRequestWithAccessToken,
  ) {
    const balanceConvertUpdate = {
      ...body,
      configBy: accessTokenInfo.uid,
    }
    return this.balanceConvertService.updateBalanceConvert(balanceConvertUpdate)
  }

  @Post('/:id/delete')
  @CheckPermission(Permission.BALANCE_CONVERT_SETTING_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete balance convert setting' })
  async deleteBalanceConvert(@Param('id') id: string) {
    return this.balanceConvertService.deleteBalanceConvert(id)
  }
}
