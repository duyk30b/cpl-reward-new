import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { BalanceAccountDto } from '../balance-account/balance-account.dto'
import { BalanceTransaction } from '../balance-transaction/balance-transaction.dto'
import {
  BalanceTransferDto,
  BalanceTransferReponseDto,
} from './balance-transfer.dto'
import {
  IBalanceTransferService,
  IListTransferRequest,
  ISelfTransferRequest,
} from './balance-transfer.interface'

@Injectable()
export class GBalanceTransferService {
  protected readonly logger = new Logger(GBalanceTransferService.name)
  private balanceTransferService: IBalanceTransferService
  constructor(@Inject('BALANCE_TRANSFER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.balanceTransferService =
      this.client.getService<IBalanceTransferService>('TransferService')
  }

  async selfTransfer(selfTransferRequest: ISelfTransferRequest) {
    try {
      this.logger.debug('gRPC: Run Self Transfer')

      const result = await lastValueFrom(
        this.balanceTransferService.self(selfTransferRequest),
      )

      return {
        data: plainToInstance(BalanceTransferReponseDto, {
          balanceAccounts: plainToInstance(
            BalanceAccountDto,
            result.balanceAccounts,
          ),
          balanceTransactions: plainToInstance(
            BalanceTransaction,
            result.balanceTransactions,
          ),
          balanceTransfer: plainToInstance(
            BalanceTransferDto,
            result.balanceTransfer,
          ),
        }),
      }
    } catch (error) {
      this.logger.debug('gRPC: selfTransfer error:' + JSON.stringify(error))
      throw new Error(error)
    }
  }

  async listTransfer(listTransferRequest: IListTransferRequest) {
    this.logger.debug('gRPC: Run List Transfer')

    const result = await lastValueFrom(
      this.balanceTransferService.list(listTransferRequest),
    )
    return {
      data: plainToInstance(BalanceTransferDto, result.data),
      pagination: result.pagination,
    }
  }
}
