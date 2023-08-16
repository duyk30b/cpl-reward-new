import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common'
import { ApiObmSettingService } from './api-obm-setting.service'
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger'
import {
  bodyGeneric,
  OBMExchangeParams,
  ObmExchangeSettingDTO,
  OBMPairParams,
  ObmPairSettingDTO,
  OBMSystemTargetParams,
} from '@lib/grpc-client/obm-setting/obm-setting.dto'
import {
  IOBMSystemTarget,
  PairActiveRes,
  IPairPropertyItem,
  IOBMBalance,
  IOBMThreshold,
} from '@lib/grpc-client/obm-setting/obm-setting.interface'
import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'
import { TokenInformation } from '../decorators/current-user.decorator'
import { IAccessTokenPayload } from '@lib/authorization/interfaces/access-token-payload.interface'

@Controller('obm-setting')
@ApiTags('obm-setting')
export class ApiObmSettingController {
  constructor(private readonly obmSettingService: ApiObmSettingService) {}

  @ApiOperation({ summary: 'Get pair setting' })
  @Get('pair')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.OBM_SETTING_READ)
  async getOBMPairSetting(
    @Query() query: OBMPairParams,
  ): Promise<bodyGeneric<IPairPropertyItem>> {
    return await this.obmSettingService.getOBMPairSetting(query)
  }

  @ApiOperation({ summary: 'Get pair active setting' })
  @Get('pair-active')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.OBM_SETTING_READ)
  async getOBMPairActive(): Promise<bodyGeneric<PairActiveRes>> {
    return await this.obmSettingService.getOBMPairActive()
  }

  @ApiOperation({ summary: 'update pair setting' })
  @Put('pair')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ObmPairSettingDTO })
  @CheckPermission(Permission.OBM_SETTING_UPDATE)
  async updatePair(
    @TokenInformation() token: IAccessTokenPayload,
    @Body()
    pairSetting: ObmPairSettingDTO,
  ) {
    pairSetting.data = pairSetting.data.map((item) => {
      return { ...item, updateBy: token.uid }
    })
    return await this.obmSettingService.updatePairSetting(pairSetting)
  }

  @ApiOperation({ summary: 'Get exchange setting' })
  @Get('exchange')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.OBM_SETTING_READ)
  async getOBMExchangeSetting(
    @Query() query: OBMExchangeParams,
  ): Promise<ObmExchangeSettingDTO> {
    return await this.obmSettingService.getOBMExchangeSetting(query)
  }

  @ApiOperation({ summary: 'update exchange setting' })
  @Put('exchange')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ObmExchangeSettingDTO })
  @CheckPermission(Permission.OBM_SETTING_UPDATE)
  async updateExchange(
    @TokenInformation() token: IAccessTokenPayload,
    @Body()
    exchangeSetting: ObmExchangeSettingDTO,
  ) {
    exchangeSetting.data = exchangeSetting.data.map((item) => {
      return { ...item, updateBy: token.uid }
    })
    return await this.obmSettingService.updateExchangeSetting(exchangeSetting)
  }

  @ApiOperation({ summary: 'Get system target setting' })
  @Get('system-target')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.OBM_SETTING_READ)
  async getOBMSysTarget(
    @Query() query: OBMSystemTargetParams,
  ): Promise<IOBMSystemTarget> {
    return await this.obmSettingService.getOBMSystemTarget(query)
  }

  @ApiOperation({ summary: 'Get balance setting' })
  @Get('balance')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.OBM_SETTING_READ)
  async getOBMBalance(): Promise<IOBMBalance> {
    return await this.obmSettingService.getOBMBalance()
  }

  @ApiOperation({ summary: 'Get threshold setting' })
  @Get('threshold')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.OBM_SETTING_READ)
  async getOBMThreshold(): Promise<IOBMThreshold> {
    return await this.obmSettingService.getOBMThreshold()
  }

  @ApiOperation({ summary: 'Delete pair in exchange' })
  @Put('delete-pair')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: OBMSystemTargetParams })
  @CheckPermission(Permission.OBM_SETTING_DELETE)
  async deletePairInExchange(
    @Body()
    exchangeSetting: OBMSystemTargetParams,
  ) {
    return await this.obmSettingService.deletePairInExchange(exchangeSetting)
  }
}
