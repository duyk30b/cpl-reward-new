import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom, map } from 'rxjs'
import { GrpcCoinSettingDto } from '../../exchange-setting/dtos/coin'
import { plainToInstance } from 'class-transformer'
import { IAutoAddSettingService } from './auto-add-setting.interface'
import {
  ChangeStatusDepositWithdrawResponse,
  CreateCurrencySettingDto,
  GetCurrencySettingDto,
  GrpcCurrencySettingResponse,
  UpdateCurrencySettingDto,
  UpdateStatusDepositWithdrawDto,
} from './auto-add-setting.dto'
import { IRequestWithAccessToken } from '../../../../../apps/api/src/interfaces/request-with-access-token'
import { getClientIp } from 'request-ip'
import { UploadFileService } from '@lib/upload-file'
import { BusinessException, UploadFileError } from '@lib/util'
import { CommonSettingConstant } from '../common-setting.constant'

@Injectable()
export class AutoAddSettingService {
  protected readonly logger = new Logger(AutoAddSettingService.name)
  private currencySettingService: IAutoAddSettingService
  constructor(
    @Inject(CommonSettingConstant.GRPC_COMMON_SETTING_AUTO_ADD)
    private client: ClientGrpc,
    private readonly uploadFileService: UploadFileService,
  ) {}

  onModuleInit() {
    this.currencySettingService =
      this.client.getService<IAutoAddSettingService>('CurrencySettingService')
  }

  public setCurrency(
    request: CreateCurrencySettingDto,
  ): Promise<GrpcCoinSettingDto> {
    const input = {
      coin: request.coin,
      name: request.coinName,
      contractAddress: request.contractAddress,
      icon: request.icon,
      env: request.env,
      decimal: request.decimals,
      confirmations: request.requiredConfirmations,
      transactionExplorer: request.transactionExplorer,
      transactionTxPath: request.transactionPath,
      type: request.type,
      withdrawalThreshold: request.withdrawalThreshold,
      onDeposit: request.onDeposit,
      onWithdrawal: request.onWithdrawal,
      fee: request.fee,
      minimumWithdrawal: request.minimumWithdrawal,
      withdrawalLimit: request.withdrawalLimit,
      timeReset: +request.timeReset,
    }

    return lastValueFrom(
      this.currencySettingService
        .setCurrencySetting(input)
        .pipe(map((result) => plainToInstance(GrpcCoinSettingDto, result))),
    )
  }

  public updateCurrency(
    request: UpdateCurrencySettingDto,
  ): Promise<GrpcCoinSettingDto> {
    const input = {
      coin: request.coin,
      name: request.coinName,
    }

    return lastValueFrom(
      this.currencySettingService
        .updateCurrencySetting(input)
        .pipe(map((result) => plainToInstance(GrpcCoinSettingDto, result))),
    )
  }

  async uploadIcon(
    file: Express.Multer.File,
    request: IRequestWithAccessToken,
  ) {
    if (file.mimetype !== 'image/png') {
      throw new BusinessException(UploadFileError.WRONG_FILE_TYPE)
    }
    if (file.size === 0) {
      throw new BusinessException(UploadFileError.BLANK_FILE)
    }
    if (file.size > 2000000) {
      throw new BusinessException(UploadFileError.OVER_1MB)
    }
    const ip = getClientIp(request)
    const otherData = {
      ip,
      adminId: request.accessTokenInfo ? request.accessTokenInfo.uid : '0',
      userAgent: request.headers['user-agent'],
    }
    const uploaded = await this.uploadFileService.uploadForBce(
      file,
      'images',
      otherData,
      file.originalname.replace(/[^a-zA-Z0-9.]/g, '-').replace(/\s/g, ''),
    )
    if (uploaded.name === undefined) return { url: '' }
    return { url: uploaded.url }
  }

  public getListCurrency(
    query: GetCurrencySettingDto,
  ): Promise<GrpcCurrencySettingResponse> {
    return lastValueFrom(
      this.currencySettingService.getCurrencySetting(query).pipe(
        map((result) =>
          plainToInstance(GrpcCurrencySettingResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public updateStatusDepositWithdraw(
    request: UpdateStatusDepositWithdrawDto,
  ): Promise<ChangeStatusDepositWithdrawResponse> {
    const input = {
      coin: request.coin,
      type: request.type,
      status: request.status,
    }

    return lastValueFrom(
      this.currencySettingService
        .updateDepositWithdraw(input)
        .pipe(
          map((result) =>
            plainToInstance(ChangeStatusDepositWithdrawResponse, result),
          ),
        ),
    )
  }
}
