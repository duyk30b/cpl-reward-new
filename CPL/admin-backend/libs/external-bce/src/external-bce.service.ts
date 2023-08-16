import { IRequestAdminActionLog } from '@lib/log/interfaces/admin-action-log.interface'
import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom, map } from 'rxjs'

import { CurrencyResponse } from '@lib/external-bce/external-bce.dto'
import { IRequestLogInfo } from '@lib/external-bce/external-bce.interface'
import {
  CreateCurrencySettingDto,
  UpdateCurrencySettingDto,
  UpdateStatusDepositWithdrawDto,
} from '@lib/grpc-client/common-setting/auto-add-setting/auto-add-setting.dto'
import { LogService } from '@lib/log'
import { ValidCurrencyDto } from 'apps/api/src/api-auto-add-setting/dto/api-auto-add.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class ExternalBceService {
  protected readonly logger = new Logger(ExternalBceService.name)
  private url
  private secret
  private readonly now

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private logService: LogService,
  ) {
    this.url = this.configService.get('bce.url')
    this.secret = this.configService.get('bce.secret')
    this.now = Date.now()
  }

  private async createRequestLogAction(
    endpoint: string,
    postData: any,
    requestLogInfo: IRequestLogInfo,
    method: string,
  ): Promise<IRequestAdminActionLog> {
    const requestLog = {
      adminId: requestLogInfo.adminId,
      ip: requestLogInfo.ip,
      endpoint,
      method,
      request: JSON.stringify({
        body: postData,
        query: {},
        params: {},
      }),
      response: '',
      statusCode: 200,
    }
    return await this.logService.requestLog(requestLog)
  }

  async cancelWithdraw(
    userIds: string,
    requestLogInfo: IRequestLogInfo,
  ): Promise<any> {
    const fullUrl = `${this.url}/users/reject-withdraw`

    const postData = {
      internal_secret: this.secret,
      user_ids: userIds,
    }

    const requestLog = await this.createRequestLogAction(
      fullUrl,
      postData,
      requestLogInfo,
      'POST',
    )

    this.logger.log(
      JSON.stringify({
        name: 'cancelWithdraw',
        url: fullUrl,
        data: { user_ids: userIds },
      }),
    )

    try {
      const result = await firstValueFrom(
        await this.httpService
          .post(fullUrl, JSON.stringify(postData), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )
      await this.logService.responseLog({
        ...requestLog,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(result),
      })
      return {
        result: true,
        message: '',
        response: result,
      }
    } catch (e) {
      if (e.response === undefined) {
        await this.logService.responseLog({
          ...requestLog,
          statusCode: 500,
          timeProcessed: Date.now() - this.now,
          response: JSON.stringify(e.message),
        })
        return {
          result: false,
          message: e.message,
          response: undefined,
        }
      }

      const messageError = {
        statusCode: e.response.status,
        statusText: e.response.statusText,
        detailMessage:
          e.response.status === HttpStatus.UNAUTHORIZED
            ? e.message
            : e.response.data.message,
      }
      await this.logService.responseLog({
        ...requestLog,
        statusCode: messageError.statusCode,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(messageError),
      })
      return {
        result: false,
        message: '',
        response: messageError,
      }
    }
  }

  async cancelOrder(
    userId: string,
    requestLogInfo: IRequestLogInfo,
  ): Promise<any> {
    const fullUrl = `${this.url}/cancel-all`

    const postData = {
      internal_secret: this.secret,
      user_id: userId,
    }

    const requestLog = await this.createRequestLogAction(
      fullUrl,
      postData,
      requestLogInfo,
      'PUT',
    )

    this.logger.log(
      JSON.stringify({
        name: 'cancelOrder',
        url: fullUrl,
        data: { user_id: userId },
      }),
    )

    try {
      const result = await firstValueFrom(
        await this.httpService
          .put(fullUrl, JSON.stringify(postData), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )
      await this.logService.responseLog({
        ...requestLog,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(result),
      })
      return {
        result: true,
        message: '',
        response: result,
      }
    } catch (e) {
      if (e.response === undefined) {
        await this.logService.responseLog({
          ...requestLog,
          statusCode: 500,
          timeProcessed: Date.now() - this.now,
          response: JSON.stringify(e.message),
        })
        return {
          result: false,
          message: e.message,
          response: undefined,
        }
      }

      const messageError = {
        statusCode: e.response.status,
        statusText: e.response.statusText,
        detailMessage:
          e.response.status === HttpStatus.UNAUTHORIZED
            ? e.message
            : e.response.data.message,
      }
      await this.logService.responseLog({
        ...requestLog,
        statusCode: messageError.statusCode,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(messageError),
      })
      return {
        result: false,
        message: '',
        response: messageError,
      }
    }
  }

  async autoAddNewCurrency(
    item: CreateCurrencySettingDto,
    requestLogInfo: IRequestLogInfo,
  ): Promise<any> {
    const bceAdminUrl = this.configService.get('bce.admin_url')
    const secret = this.configService.get('bce.admin_secret')
    const fullUrl = `${bceAdminUrl}/api/internal/autoadd/new-currency`

    const postData = {
      internal_secret: secret,
      type: item.type,
      contract_address: item.contractAddress,
      coin: item.coin,
      coin_name: item.coinName,
      icon: item.icon,
      env: item.env,
      decimals: item.decimals,
      required_confirmations: item.requiredConfirmations,
      transaction_explorer: item.transactionExplorer,
      transaction_path: item.transactionPath,
      on_deposit: item.onDeposit,
      on_withdrawal: item.onWithdrawal,
      minimum_withdrawal: item.minimumWithdrawal,
      fee: item.fee,
      withdrawal_limit: item.withdrawalLimit,
      time_reset: item.timeReset,
      withdrawal_threshold: item.withdrawalThreshold,
      price: item.price,
    }

    const requestLog = await this.createRequestLogAction(
      fullUrl,
      postData,
      requestLogInfo,
      'POST',
    )

    this.logger.log(
      JSON.stringify({
        name: 'autoAddNewCurrency',
        url: fullUrl,
        data: {
          type: item.type,
          contract_address: item.contractAddress,
          coin: item.coin,
          coin_name: item.coinName,
          icon: item.icon,
          env: item.env,
          decimals: item.decimals,
          required_confirmations: item.requiredConfirmations,
          transaction_explorer: item.transactionExplorer,
          transaction_path: item.transactionPath,
          on_deposit: item.onDeposit,
          on_withdrawal: item.onWithdrawal,
          minimum_withdrawal: item.minimumWithdrawal,
          fee: item.fee,
          withdrawal_limit: item.withdrawalLimit,
          time_reset: item.timeReset,
          withdrawal_threshold: item.withdrawalThreshold,
          price: item.price,
        },
      }),
    )

    try {
      const result = await firstValueFrom(
        await this.httpService
          .post(fullUrl, JSON.stringify(postData), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )
      await this.logService.responseLog({
        ...requestLog,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(result),
      })
      return plainToInstance(CurrencyResponse, {
        result: true,
        response: result,
      })
    } catch (e) {
      if (e.response === undefined) {
        await this.logService.responseLog({
          ...requestLog,
          statusCode: 500,
          timeProcessed: Date.now() - this.now,
          response: JSON.stringify(e.message),
        })
        return plainToInstance(CurrencyResponse, {
          result: false,
          response: { message: e.message },
        })
      }

      const messageError = {
        statusCode: e.response.status,
        statusText: e.response.statusText,
        detailMessage:
          e.response.status === HttpStatus.UNAUTHORIZED
            ? e.message
            : e.response.data.message,
      }
      await this.logService.responseLog({
        ...requestLog,
        statusCode: messageError.statusCode,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(messageError),
      })
      return plainToInstance(CurrencyResponse, {
        result: false,
        response: e.response.data ?? messageError,
      })
    }
  }

  async autoAddUpdateCurrency(
    item: UpdateCurrencySettingDto,
    requestLogInfo: IRequestLogInfo,
  ): Promise<any> {
    const bceAdminUrl = this.configService.get('bce.admin_url')
    const secret = this.configService.get('bce.admin_secret')
    const fullUrl = `${bceAdminUrl}/api/internal/autoadd/update-currency`

    const postData = {
      internal_secret: secret,
      coin: item.coin,
      name: item.coinName,
      env: item.env,
    }

    const requestLog = await this.createRequestLogAction(
      fullUrl,
      postData,
      requestLogInfo,
      'POST',
    )

    this.logger.log(
      JSON.stringify({
        name: 'autoAddUpdateCurrency',
        url: fullUrl,
        data: {
          coin: item.coin,
          name: item.coinName,
          env: item.env,
        },
      }),
    )

    try {
      const result = await firstValueFrom(
        await this.httpService
          .post(fullUrl, JSON.stringify(postData), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )
      await this.logService.responseLog({
        ...requestLog,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(result),
      })
      return plainToInstance(CurrencyResponse, {
        result: true,
        response: result,
      })
    } catch (e) {
      if (e.response === undefined) {
        await this.logService.responseLog({
          ...requestLog,
          statusCode: 500,
          timeProcessed: Date.now() - this.now,
          response: JSON.stringify(e.message),
        })
        return plainToInstance(CurrencyResponse, {
          result: false,
          response: { message: e.message },
        })
      }

      const messageError = {
        statusCode: e.response.status,
        statusText: e.response.statusText,
        detailMessage:
          e.response.status === HttpStatus.UNAUTHORIZED
            ? e.message
            : e.response.data.message,
      }
      await this.logService.responseLog({
        ...requestLog,
        statusCode: messageError.statusCode,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(messageError),
      })
      return plainToInstance(CurrencyResponse, {
        result: false,
        response: e.response.data ?? messageError,
      })
    }
  }

  async autoAddChangeStatus(
    item: UpdateStatusDepositWithdrawDto,
    requestLogInfo: IRequestLogInfo,
  ): Promise<any> {
    const bceAdminUrl = this.configService.get('bce.admin_url')
    const secret = this.configService.get('bce.admin_secret')
    const fullUrl = `${bceAdminUrl}/api/internal/autoadd/change-status-deposit-withdrawal`

    const postData = {
      internal_secret: secret,
      coin: item.coin,
      type: item.type,
      status: item.status,
    }

    const requestLog = await this.createRequestLogAction(
      fullUrl,
      postData,
      requestLogInfo,
      'POST',
    )

    this.logger.log(
      JSON.stringify({
        name: 'autoAddChangeStatus',
        url: fullUrl,
        data: {
          coin: item.coin,
          type: item.type,
          status: item.status,
        },
      }),
    )

    try {
      const result = await firstValueFrom(
        await this.httpService
          .post(fullUrl, JSON.stringify(postData), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )
      await this.logService.responseLog({
        ...requestLog,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(result),
      })
      return plainToInstance(CurrencyResponse, {
        result: true,
        response: result,
      })
    } catch (e) {
      if (e.response === undefined) {
        await this.logService.responseLog({
          ...requestLog,
          statusCode: 500,
          timeProcessed: Date.now() - this.now,
          response: JSON.stringify(e.message),
        })
        return plainToInstance(CurrencyResponse, {
          result: false,
          response: { message: e.message },
        })
      }

      const messageError = {
        statusCode: e.response.status,
        statusText: e.response.statusText,
        detailMessage:
          e.response.status === HttpStatus.UNAUTHORIZED
            ? e.message
            : e.response.data.message,
      }
      await this.logService.responseLog({
        ...requestLog,
        statusCode: messageError.statusCode,
        timeProcessed: Date.now() - this.now,
        response: JSON.stringify(messageError),
      })
      return plainToInstance(CurrencyResponse, {
        result: false,
        message: '',
        response: e.response.data ?? messageError,
      })
    }
  }

  async autoAddCheckValidCurrency(
    validCurrencyDto: ValidCurrencyDto,
  ): Promise<any> {
    const bceAdminUrl = this.configService.get('bce.admin_url')
    const secret = this.configService.get('bce.admin_secret')
    const fullUrl = `${bceAdminUrl}/api/internal/autoadd/valid-currency`

    const postData = {
      internal_secret: secret,
      coin: validCurrencyDto.coin,
      coin_name: validCurrencyDto.coinName,
      contract_address: validCurrencyDto.contractAddress,
      coin_edit: validCurrencyDto.coinEdit,
    }

    try {
      const result = await firstValueFrom(
        await this.httpService
          .post(fullUrl, JSON.stringify(postData), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )

      return plainToInstance(CurrencyResponse, {
        result: true,
        response: result,
      })
    } catch (e) {
      if (e.response === undefined) {
        return plainToInstance(CurrencyResponse, {
          result: false,
          response: { message: e.message },
        })
      }

      const messageError = {
        statusCode: e.response.status,
        statusText: e.response.statusText,
        detailMessage:
          e.response.status === HttpStatus.UNAUTHORIZED
            ? e.message
            : e.response.data.message,
      }

      return plainToInstance(CurrencyResponse, {
        result: false,
        message: '',
        response: e.response.data ?? messageError,
      })
    }
  }
}
