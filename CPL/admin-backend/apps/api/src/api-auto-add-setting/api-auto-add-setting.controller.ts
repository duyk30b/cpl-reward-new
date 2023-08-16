import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { AutoAddSettingService } from '@lib/grpc-client/common-setting/auto-add-setting/auto-add-setting.service'
import { GrpcCoinSettingDto } from '@lib/grpc-client/exchange-setting/dtos/coin'
import {
  ChangeStatusDepositWithdrawResponse,
  CreateCurrencySettingDto,
  GetCurrencySettingDto,
  GrpcCurrencySettingResponse,
  ResponseUploadIconDto,
  UpdateCurrencySettingDto,
  UpdateStatusDepositWithdrawDto,
} from '@lib/grpc-client/common-setting/auto-add-setting/auto-add-setting.dto'
import { GetSmartContractDto, ValidCurrencyDto } from './dto/api-auto-add.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { ApiAutoAddSettingService } from './api-auto-add-setting.service'
import { getClientIp } from 'request-ip'
import { CurrencyResponse } from '@lib/external-bce/external-bce.dto'
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger/dist/decorators/api-response.decorator'
import { HotWalletService } from '@lib/grpc-client/hot-wallet/services'
import { SmartContractDto } from '@lib/grpc-client/hot-wallet/dtos'

@ApiTags('Auto Add setting')
@Controller('api-auto-add-setting')
export class ApiAutoAddSettingController {
  constructor(
    private readonly autoAddSettingService: AutoAddSettingService,
    private readonly apiAutoAddSettingService: ApiAutoAddSettingService,
    private readonly hotWalletService: HotWalletService,
  ) {}

  @Get('currency')
  @CheckPermission(Permission.AUTO_ADD_SETTING_LIST)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List currency setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcCurrencySettingResponse })
  async getCoinSettings(@Query() filter: GetCurrencySettingDto) {
    return await this.autoAddSettingService.getListCurrency(filter)
  }

  @Post('currency')
  @CheckPermission(Permission.AUTO_ADD_SETTING_CREATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a currency setting' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GrpcCoinSettingDto })
  @ApiBadRequestResponse({ type: CurrencyResponse })
  @ApiInternalServerErrorResponse({ type: CurrencyResponse })
  @ApiBody({ type: CreateCurrencySettingDto })
  async createCurrency(
    @Req() req: IRequestWithAccessToken,
    @Body() item: CreateCurrencySettingDto,
  ) {
    const requestLogInfo = {
      adminId: req.accessTokenInfo ? req.accessTokenInfo.uid : '0',
      userAgent: req.headers['user-agent'],
      ip: getClientIp(req),
    }
    return await this.apiAutoAddSettingService.createCurrency(
      item,
      requestLogInfo,
    )
  }

  @Patch('currency')
  @CheckPermission(Permission.AUTO_ADD_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Patch a currency setting' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GrpcCoinSettingDto })
  @ApiBadRequestResponse({ type: CurrencyResponse })
  @ApiInternalServerErrorResponse({ type: CurrencyResponse })
  @ApiBody({ type: UpdateCurrencySettingDto })
  async updateCurrency(
    @Req() req: IRequestWithAccessToken,
    @Body() item: UpdateCurrencySettingDto,
  ) {
    const requestLogInfo = {
      adminId: req.accessTokenInfo ? req.accessTokenInfo.uid : '0',
      userAgent: req.headers['user-agent'],
      ip: getClientIp(req),
    }
    return await this.apiAutoAddSettingService.updateCurrency(
      item,
      requestLogInfo,
    )
  }

  /**
   * @comment https://stackoverflow.com/questions/66605192/file-uploading-along-with-other-data-in-swagger-nestjs
   * @param file
   * @param request
   */
  @Post('/currency/upload')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.AUTO_ADD_SETTING_CREATE)
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
  @ApiResponse({ type: ResponseUploadIconDto })
  async uploadIcon(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: IRequestWithAccessToken,
  ) {
    return await this.autoAddSettingService.uploadIcon(file, request)
  }

  @Get('smart-contract')
  @CheckPermission(Permission.AUTO_ADD_SMART_CONTRACT_GET)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get smart contract by currency' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: SmartContractDto })
  async getSmartContract(@Query() query: GetSmartContractDto) {
    const { data } = await this.hotWalletService.getSmartContractInfo(query)
    data.transactionPath = data.transactionExplorer + data.transactionPath

    return data
  }

  @Post('/currency/status')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.AUTO_ADD_SETTING_LIST)
  @ApiOperation({
    summary: 'Change status deposit/withdraw a currency setting',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateStatusDepositWithdrawDto })
  @ApiOkResponse({ type: ChangeStatusDepositWithdrawResponse })
  @ApiBadRequestResponse({ type: CurrencyResponse })
  @ApiInternalServerErrorResponse({ type: CurrencyResponse })
  async updateStatus(
    @Req() req: IRequestWithAccessToken,
    @Body() item: UpdateStatusDepositWithdrawDto,
  ) {
    const requestLogInfo = {
      adminId: req.accessTokenInfo ? req.accessTokenInfo.uid : '0',
      userAgent: req.headers['user-agent'],
      ip: getClientIp(req),
    }
    return await this.apiAutoAddSettingService.updateStatusDepositWithdraw(
      item,
      requestLogInfo,
    )
  }

  /**
   * @param req
   * @param validCurrencyDto
   */
  @Get('/valid-currency')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ValidCurrencyDto })
  @ApiOperation({ summary: 'Check valid contract from bce' })
  @HttpCode(HttpStatus.OK)
  async checkValidCurrency(
    @Req() req: IRequestWithAccessToken,
    @Query() validCurrencyDto: ValidCurrencyDto,
  ) {
    return await this.apiAutoAddSettingService.checkValidCurrency(
      validCurrencyDto,
    )
  }
}
