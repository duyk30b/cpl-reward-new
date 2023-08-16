import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import {
  AbnormalBalanceAccountEntityDto,
  AbnormalBalanceHistoryEntityDto,
  AbnormalBalanceUserEntityDto,
  ResponseCorrectEntity,
  ResponseGetDiffBalanceEntity,
} from './balance-monitor.dto'
import {
  IBalanceMonitorService,
  ICheckBalanceInvalidRequest,
  ICorrectRequest,
  IGetAbnormalBalanceAccountsRequest,
  IGetAbnormalBalanceHistoriesRequest,
  IGetAbnormalBalanceUsersRequest,
  IGetDiffBalanceRequest,
} from './balance-monitor.interface'

@Injectable()
export class GBalanceMonitorService {
  protected readonly logger = new Logger(GBalanceMonitorService.name)
  private balanceMonitorService: IBalanceMonitorService
  constructor(@Inject('BALANCE_MONITOR_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.balanceMonitorService = this.client.getService<IBalanceMonitorService>(
      'BalanceMonitorService',
    )
  }

  async correct(request: ICorrectRequest) {
    this.logger.debug('gRPC: GBalanceMonitorService@getAbnormalBalanceUsers')

    const result = await lastValueFrom(
      this.balanceMonitorService.correct(request),
    )
    return {
      data: plainToInstance(ResponseCorrectEntity, result),
    }
  }

  async getDiffBalanceCorrect(request: IGetDiffBalanceRequest) {
    this.logger.debug('gRPC: GBalanceMonitorService@getDiffBalanceCorrect')

    const result = await lastValueFrom(
      this.balanceMonitorService.getDiffBalanceCorrect(request),
    )
    return {
      data: plainToInstance(ResponseGetDiffBalanceEntity, result),
    }
  }

  async checkBalanceInvalid(request: ICheckBalanceInvalidRequest) {
    this.logger.debug('gRPC: GBalanceMonitorService@checkBalanceInvalid')
    return lastValueFrom(
      this.balanceMonitorService.checkBalanceInvalid(request),
    )
  }

  async getAbnormalBalanceUsers(request: IGetAbnormalBalanceUsersRequest) {
    this.logger.debug('gRPC: GBalanceMonitorService@getAbnormalBalanceUsers')

    const result = await lastValueFrom(
      this.balanceMonitorService.getAbnormalBalanceUsers(request),
    )
    return {
      data: result.data
        ? plainToInstance(AbnormalBalanceUserEntityDto, result.data)
        : [],
      pagination: result.pagination,
    }
  }

  async getAbnormalBalanceAccounts(
    request: IGetAbnormalBalanceAccountsRequest,
  ) {
    this.logger.debug('gRPC: GBalanceMonitorService@getAbnormalBalanceAccounts')

    const result = await lastValueFrom(
      this.balanceMonitorService.getAbnormalBalanceAccounts(request),
    )
    return {
      data: result.data
        ? plainToInstance(AbnormalBalanceAccountEntityDto, result.data)
        : [],
    }
  }

  async getAbnormalBalanceHistories(
    request: IGetAbnormalBalanceHistoriesRequest,
  ) {
    this.logger.debug(
      'gRPC: GBalanceMonitorService@getAbnormalBalanceHistories',
    )

    const result = await lastValueFrom(
      this.balanceMonitorService.getAbnormalBalanceHistories(request),
    )
    return {
      data: result.data
        ? plainToInstance(AbnormalBalanceHistoryEntityDto, result.data)
        : [],
      pagination: result.pagination,
    }
  }
}
