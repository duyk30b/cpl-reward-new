import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { BalanceAccountDto } from '../balance-account/balance-account.dto'
import {
  BalanceTransaction,
  CreateTransactionRequest,
  CreateTransactionResponse,
} from './balance-transaction.dto'
import { IBalanceTransactionService } from './balance-transaction.interface'

@Injectable()
export class BalanceTransactionService {
  protected readonly logger = new Logger(BalanceTransactionService.name)
  private transactionService: IBalanceTransactionService
  constructor(
    @Inject('BALANCE_TRANSACTION_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.transactionService =
      this.client.getService<IBalanceTransactionService>('TransactionService')
  }

  async create(
    createRequest: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    try {
      this.logger.debug(
        'Call create transaction function with gRPC: ' +
          JSON.stringify(createRequest),
      )

      const response = await lastValueFrom(
        this.transactionService
          .create(createRequest)
          .pipe(map((data) => this.convertDataCreateTransaction(data))),
      )

      this.logger.debug(
        'Response of create transaction function with gRPC: ' +
          JSON.stringify(response),
      )

      return plainToInstance(CreateTransactionResponse, response)
    } catch (error) {
      this.logger.error('Error call Grpc transaction:' + JSON.stringify(error))
      throw new Error(error)
    }
  }

  async convertDataCreateTransaction(data: CreateTransactionResponse) {
    const balanceAccounts = data.balanceAccounts
      ? data.balanceAccounts.map((balaneAccount) =>
          plainToInstance(BalanceAccountDto, balaneAccount),
        )
      : null
    const balanceTransactions = data.balanceTransactions
      ? data.balanceTransactions.map((balanceTransaction) =>
          plainToInstance(BalanceTransaction, balanceTransaction),
        )
      : null
    return {
      balanceAccounts,
      balanceTransactions,
    }
  }

  async getUserBalanceChangeHistory(params) {
    return lastValueFrom(
      this.transactionService
        .getBalanceChangeHistory(params)
        .pipe(map((data) => data)),
    )
  }
}
