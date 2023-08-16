import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { BalanceHistoryEntityResultDto } from './balance-history.dto'
import {
  IBalanceHistoryService,
  IListHistoryRequest,
} from './balance-history.interface'

@Injectable()
export class GBalanceHistoryService {
  protected readonly logger = new Logger(GBalanceHistoryService.name)
  private balanceHistoryService: IBalanceHistoryService
  constructor(@Inject('BALANCE_HISTORY_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.balanceHistoryService = this.client.getService<IBalanceHistoryService>(
      'BalanceHistoryService',
    )
  }

  async listHistory(listHistoryRequest: IListHistoryRequest) {
    this.logger.debug('gRPC: Run List History')
    const result = await lastValueFrom(
      this.balanceHistoryService.list(listHistoryRequest),
    )
    return {
      data: result.data
        ? plainToInstance(BalanceHistoryEntityResultDto, result.data)
        : [],
      pagination: result.pagination,
    }
  }
}
