import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { BalanceType, TransactionType } from './grpc-services/transaction/transaction.enum'
import { TransactionService } from './grpc-services/transaction/transaction.service'
import { ISendReward } from './new-balance.interface'

@Injectable()
export class NewBalanceService {
  constructor(
    private eventEmitter: EventEmitter2,
    private transactionService: TransactionService,
  ) {}

  async sendReward(
    userId: string,
    amount: string,
    currency: string,
    referenceId: string,
    balance: BalanceType,
    data: any,
  ): Promise<{
    result: boolean
    message: any
    balanceTransactionId?: string
  }> {
    const transformedCurrency = currency.toLowerCase()
    const requestData = {
      userId: userId,
      items: [
        {
          balanceType: balance,
          transactionType: TransactionType.REWARD,
          currency: transformedCurrency,
          amount: amount,
          transactionReferenceId: referenceId,
          alternatives: [],
        },
      ],
    }
    try {
      const result = await this.transactionService.createTransaction(requestData)

      return {
        result: true,
        message: '',
        balanceTransactionId: result.balanceTransactions?.[0]?.id,
      }
    } catch (e) {
      return {
        result: false,
        message: e,
      }
    }
  }

  async startSendReward(data: ISendReward) {
    const result = await this.transactionService.createTransaction({
      userId: data.userId,
      items: [
        {
          balanceType: data.balance,
          transactionType: TransactionType.REWARD,
          currency: data.currency.toLowerCase(),
          amount: data.amount,
          transactionReferenceId: data.referenceId,
          alternatives: [],
        },
      ],
    })

    return { balanceTransactionId: result.balanceTransactions?.[0]?.id }
  }
}
