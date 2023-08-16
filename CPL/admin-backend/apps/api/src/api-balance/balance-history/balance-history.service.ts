import { Injectable } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { GBalanceHistoryService } from '@lib/grpc-client/balance-history/balance-history.service'
import { ListBalanceHistoryRequestDto } from './balance-history.dto'
import { IListHistoryRequest } from '@lib/grpc-client/balance-history/balance-history.interface'

@Injectable()
export class BalanceHistoryService {
  constructor(private gBalanceHistoryService: GBalanceHistoryService) {}

  async list(
    listBalanceHistoryRequestDto: ListBalanceHistoryRequestDto,
    getAll = false,
  ) {
    const gListBalanceHistoryRequest: IListHistoryRequest = instanceToPlain(
      { ...listBalanceHistoryRequestDto, getAll },
      { ignoreDecorators: true },
    )
    const balanceHistories = await this.gBalanceHistoryService.listHistory(
      gListBalanceHistoryRequest,
    )
    return instanceToPlain(balanceHistories)
  }
}
