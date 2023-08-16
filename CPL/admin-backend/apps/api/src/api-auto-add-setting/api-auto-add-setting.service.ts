import { Injectable, Logger } from '@nestjs/common'
import { AutoAddSettingService } from '@lib/grpc-client/common-setting/auto-add-setting/auto-add-setting.service'
import { ExternalBceService } from '@lib/external-bce'
import {
  CreateCurrencySettingDto,
  UpdateCurrencySettingDto,
  UpdateStatusDepositWithdrawDto,
} from '@lib/grpc-client/common-setting/auto-add-setting/auto-add-setting.dto'
import { ValidCurrencyDto } from './dto/api-auto-add.dto'
import { IRequestLogInfo } from '@lib/external-bce/external-bce.interface'

@Injectable()
export class ApiAutoAddSettingService {
  protected readonly logger = new Logger(ApiAutoAddSettingService.name)

  constructor(
    private readonly autoAddSettingService: AutoAddSettingService,
    private readonly externalBceService: ExternalBceService,
  ) {}

  async createCurrency(
    item: CreateCurrencySettingDto,
    requestLogInfo: IRequestLogInfo,
  ) {
    const bceAddCurrency = await this.externalBceService.autoAddNewCurrency(
      item,
      requestLogInfo,
    )
    if (!bceAddCurrency.result) return bceAddCurrency
    // set env blockchain from BCE admin
    const { env } = bceAddCurrency.response.data
    item.env = env
    return await this.autoAddSettingService.setCurrency(item)
  }

  async updateCurrency(
    item: UpdateCurrencySettingDto,
    requestLogInfo: IRequestLogInfo,
  ) {
    const bceUpdateCurrency =
      await this.externalBceService.autoAddUpdateCurrency(item, requestLogInfo)
    if (!bceUpdateCurrency.result) return bceUpdateCurrency
    return await this.autoAddSettingService.updateCurrency(item)
  }

  async updateStatusDepositWithdraw(
    item: UpdateStatusDepositWithdrawDto,
    requestLogInfo: IRequestLogInfo,
  ) {
    const bceUpdateStatus = await this.externalBceService.autoAddChangeStatus(
      item,
      requestLogInfo,
    )
    if (!bceUpdateStatus.result) return bceUpdateStatus

    return await this.autoAddSettingService.updateStatusDepositWithdraw(item)
  }

  async checkValidCurrency(validCurrencyDto: ValidCurrencyDto) {
    return await this.externalBceService.autoAddCheckValidCurrency(
      validCurrencyDto,
    )
  }
}
