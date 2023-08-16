import {
  GetDataPointParams,
  GetImportOrderStatusParams,
  GetSettingsParams,
} from '@app/market-maker'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { ApiMarketMakerOrderService } from './api-market-maker-internal-order.service'
import { ApiMarketMakerService } from './api-market-maker-data-point.service'
import { ApiMarketMakerExternalOrderService } from './api-market-maker-external-order.service'
import { GrpcMarketMakerSettingItem } from '@lib/grpc-client/market-maker-setting'
import {
  GetSystemTargetParams,
  MarketMakerPair,
  MarketMakerSettingParams,
  MarketMakerSettingV2,
  UpdateMarketMakerSettings,
} from '@lib/grpc-client/market-maker-setting-v2'
import { ConfigService } from '@nestjs/config'
import { ApiMarketMakerBCEOrderService } from './api-market-maker-bce-order.service'
import { GrpcMarketMakerService } from './api-market-maker-data-point-v2.service'

@Controller('market-maker')
@ApiTags('market-maker')
export class ApiMarketMakerController {
  private readonly exchange_target
  constructor(
    private readonly apiMarketMakerService: ApiMarketMakerService,
    private readonly grpcMarketMakerService: GrpcMarketMakerService,
    private readonly apiMarketMakerOrderService: ApiMarketMakerOrderService,
    private readonly apiMarketMakerBCEOrderService: ApiMarketMakerBCEOrderService,
    private readonly apiMMrExternalOrderService: ApiMarketMakerExternalOrderService,
    private configService: ConfigService,
  ) {
    this.exchange_target = this.configService.get(
      'market_maker_order.exchange_target',
    )
  }

  /**
   * update csv
   * @param file
   * @returns
   */
  @Post('import-file/:pairInfo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_READ)
  async uploadFile(
    @Param('pairInfo') pairParams: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const pair = pairParams.toLowerCase()
    const [coin, currency] = pair.split('-')
    if (!coin || !currency)
      throw new BadRequestException('coin or currency empty!')
    const data = this.toArrayBuffer(file.buffer)
    return this.apiMarketMakerService.importFileData(coin, currency, data)
  }

  /**
   * import data point v2
   * @param file
   * @returns
   */
  @Post('import-file-v2/:pairInfo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_READ)
  async uploadFileV2(
    @Param('pairInfo') pairParams: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const pair = pairParams.toLowerCase()
    const [coin, currency] = pair.split('-')
    if (!coin || !currency)
      throw new BadRequestException('coin or currency empty!')
    const data = this.toArrayBuffer(file.buffer)
    return this.grpcMarketMakerService.importFileData(coin, currency, data)
  }

  /**
   * update csv
   * @param file
   * @returns
   */
  @Post('import-order/:pairInfo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_MONITOR)
  async uploadOrderFile(
    @Param('pairInfo') pairParams: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const pair = pairParams.toLowerCase()
    const [coin, currency] = pair.split('-')
    if (!coin || !currency)
      throw new BadRequestException('coin or currency empty!')
    const data = this.toArrayBuffer(file.buffer)

    const pairInfo = coin.split('_')
    if (pairInfo[0] && pairInfo[1]) {
      return this.apiMMrExternalOrderService.importFileData(
        pairInfo[1],
        currency,
        data,
      )
    }
    if (!this.exchange_target || this.exchange_target === 'BCE') {
      return this.apiMarketMakerBCEOrderService.importFileData(
        coin,
        currency,
        data,
      )
    }
    return this.apiMarketMakerOrderService.importFileData(coin, currency, data)
  }

  toArrayBuffer(buffer: ArrayBuffer): Array<Array<string>> {
    const data = buffer
      .toString() // convert Buffer to string
      .split('\n') // split string to lines
      .map((e) => e.trim()) // remove white spaces for each line
      .map((e) => e.split(',').map((e) => e.trim()))
    return data
  }

  @Get('data-points')
  @HttpCode(HttpStatus.OK)
  async getDataPoints(@Query() query: GetDataPointParams) {
    return this.apiMarketMakerService.getDataPoints(query)
  }

  @Get('data-points-v2')
  @HttpCode(HttpStatus.OK)
  async getDataPointsV2(@Query() query: GetDataPointParams) {
    return this.grpcMarketMakerService.getDataPoints(query)
  }

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  async getSettings(@Query() query: GetSettingsParams) {
    return this.apiMarketMakerService.getSettings(query)
  }

  @Get('settings-admin')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_READ)
  async getSettingsAdmin(@Query() query: GetSettingsParams) {
    return this.apiMarketMakerService.getSettingsAdmin(query)
  }

  @Put('update-settings')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GrpcMarketMakerSettingItem })
  @CheckPermission(Permission.MARKET_MAKER_READ)
  async updateSettings(
    @Body()
    settings: GrpcMarketMakerSettingItem,
  ) {
    return await this.apiMarketMakerService.putSettings(settings)
  }

  @Get('import-order-status')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_MONITOR)
  async getImportStatus(@Query() query: GetImportOrderStatusParams) {
    const pairInfo = query.coin.split('_')
    if (pairInfo[0] && pairInfo[1])
      return this.apiMMrExternalOrderService.getImportStatus(
        pairInfo[1],
        query.currency,
      )
    if (!this.exchange_target || this.exchange_target === 'BCE') {
      return this.apiMarketMakerBCEOrderService.getImportStatus(query)
    }
    return this.apiMarketMakerOrderService.getImportStatus(query)
  }

  @Get('setting-v2')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_READ)
  async getSettingV2(@Query() query: MarketMakerSettingParams) {
    return this.apiMarketMakerService.getSetting(query)
  }

  @Put('setting-v2')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: MarketMakerSettingV2 })
  @CheckPermission(Permission.MARKET_MAKER_MONITOR)
  async updateSettingV2(
    @Body()
    setting: MarketMakerSettingV2,
  ) {
    return await this.apiMarketMakerService.putSetting(setting)
  }

  @Post('pair')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_MONITOR)
  async addMarketMakerPair(@Body() request: MarketMakerPair) {
    return await this.apiMarketMakerService.addMarketMakerPair(request)
  }

  @Delete('pair')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_MONITOR)
  async deleteMarketMakerPair(@Query() params: MarketMakerPair) {
    return await this.apiMarketMakerService.deleteMarketMakerPair(params)
  }

  @Get('system-target')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_READ)
  async getMarketMakerSystemTarget(@Query() request: GetSystemTargetParams) {
    return await this.apiMarketMakerService.getMarketMakerSystemTarget(request)
  }

  @Put('pair-settings')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.MARKET_MAKER_MONITOR)
  async updateMarketMakerSettings(@Body() request: UpdateMarketMakerSettings) {
    return await this.apiMarketMakerService.updateMarketMakerSettings(request)
  }
}
