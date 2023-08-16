import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { ListBalanceSwapRequest, SwapEntity } from './balance-swap-history.dto'
import { IBalanceSwapHistoryService } from './balance-swap-history.interface'
import { BalanceSwapHistoryConstant } from './balance-swap-history.constant'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class BalanceSwapHistoryService {
  protected readonly logger = new Logger(BalanceSwapHistoryService.name)
  private balanceSwapHistoryService: IBalanceSwapHistoryService
  constructor(
    @Inject(BalanceSwapHistoryConstant.GRPC_BALANCE_SWAP_HISTORY_PACKAGE)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.balanceSwapHistoryService =
      this.client.getService<IBalanceSwapHistoryService>('SwapService')
  }

  async getListBalanceSwapHistory(params: ListBalanceSwapRequest) {
    const result = await lastValueFrom(
      this.balanceSwapHistoryService.list(params).pipe(map((data) => data)),
    )
    return {
      data: result.data ? plainToInstance(SwapEntity, result.data) : [],
      pagination: result.pagination,
    }
  }
}
