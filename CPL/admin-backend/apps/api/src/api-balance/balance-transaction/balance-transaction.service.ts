import { generatorReferenceIdWithAdmin } from '@app/common'
import { BalanceTransactionService as GrpcBalanceTransactionService } from '@lib/grpc-client/balance-transaction/balance-transaction.service'
import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common'
import { BALANCE_TYPE, TRANSACTION_TYPE } from '../balance.enum'
import {
  CreateTransactionRequest,
  BalanceChangeHistoryRequest,
} from './balance-transaction.dto'
import {
  CreateTransactionRequest as CreateTransactionRequestGrpc,
  TransactionItem,
} from '@lib/grpc-client/balance-transaction'
import { UserService } from '@lib/grpc-client/user'

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class BalanceTransactionService {
  constructor(
    private gRPCBalanceTransactionService: GrpcBalanceTransactionService,
    private userService: UserService,
  ) {}

  async createTransaction(params: CreateTransactionRequest) {
    const reference_id = generatorReferenceIdWithAdmin(
      params.admin_id,
      TRANSACTION_TYPE.MANUALLY,
    )
    const infoTransaction = {
      userId: params.user_id,
      balanceType: BALANCE_TYPE[params.balance_type],
      items: [
        {
          transactionType: TRANSACTION_TYPE.MANUALLY,
          currency: params.currency,
          amount: params.amount,
          transactionReferenceId: reference_id,
        } as TransactionItem,
      ],
    } as CreateTransactionRequestGrpc

    return this.gRPCBalanceTransactionService.create(infoTransaction)
  }

  async getUserBalanceChangeHistory(params: BalanceChangeHistoryRequest) {
    const users = {}

    const result =
      await this.gRPCBalanceTransactionService.getUserBalanceChangeHistory(
        params,
      )
    if (!result.data || result.data.length === 0) {
      return { data: [], pagination: result.pagination }
    }

    let userIds = result.data.map((item) => item.userId)
    userIds = Array.from(new Set(userIds))
    const listUsers = await this.userService.findByIds(userIds)
    if (Object.keys(listUsers).length > 0) {
      for (const user of listUsers) {
        users[user.id] = user.email
      }
    }

    const data = result.data.map((item) => {
      return {
        ...item,
        email: users[item.userId] ?? null,
      }
    })
    return { data, pagination: result.pagination }
  }

  async getAllUserBalanceChangeHistory(params: BalanceChangeHistoryRequest) {
    const GET_ALL_LIMIT_PAGE = 20000
    params.page = 1
    params.limit = GET_ALL_LIMIT_PAGE

    const users = {}
    const data = []
    // 1. get data first page
    const resultFirstPage =
      await this.gRPCBalanceTransactionService.getUserBalanceChangeHistory(
        params,
      )
    if (!resultFirstPage.data || resultFirstPage.data.length === 0) {
      return { data: [] }
    }
    data.push(...resultFirstPage.data)

    // 2. get total pages
    const pages = Math.ceil(
      resultFirstPage.pagination.total / resultFirstPage.pagination.size,
    )

    // 3. get data other page
    while (params.page < pages) {
      params.page++
      const resultEachPage =
        await this.gRPCBalanceTransactionService.getUserBalanceChangeHistory(
          params,
        )
      data.push(...resultEachPage.data)
    }

    // 4. get list users by ids
    let userIds = data.map((item) => item.userId)
    userIds = Array.from(new Set(userIds))
    const listUsers = await this.userService.findByIds(userIds)
    if (Object.keys(listUsers).length > 0) {
      for (const user of listUsers) {
        users[user.id] = user.email
      }
    }

    // 5. mapping email
    const dataWithEmail = data.map((item) => {
      return {
        ...item,
        email: users[item.userId] ?? null,
      }
    })
    return { data: dataWithEmail }
  }
}
