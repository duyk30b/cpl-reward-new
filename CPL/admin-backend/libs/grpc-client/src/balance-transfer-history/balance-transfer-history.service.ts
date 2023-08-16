import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import {
  ListBalanceTransferRequest,
  BalanceTransfer,
} from './balance-transfer-history.dto'
import { IBalanceTransferHistoryService } from './balance-transfer-history.interface'
import { BalanceTransferHistoryConstant } from './balance-transfer-history.constant'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class BalanceTransferHistoryService {
  protected readonly logger = new Logger(BalanceTransferHistoryService.name)
  private balanceTransferHistoryService: IBalanceTransferHistoryService
  constructor(
    @Inject(
      BalanceTransferHistoryConstant.GRPC_BALANCE_TRANSFER_HISTORY_PACKAGE,
    )
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.balanceTransferHistoryService =
      this.client.getService<IBalanceTransferHistoryService>('TransferService')
  }

  async getListBalanceTransferHistory(params: ListBalanceTransferRequest) {
    const result = await lastValueFrom(
      this.balanceTransferHistoryService.list(params).pipe(map((data) => data)),
    )
    return {
      data: result.data ? plainToInstance(BalanceTransfer, result.data) : [],
      pagination: result.pagination,
    }
  }
}
