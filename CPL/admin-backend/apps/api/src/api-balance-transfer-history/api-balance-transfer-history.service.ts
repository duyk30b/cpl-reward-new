import { BalanceTransferHistoryService as GrpcBalanceTransferHistoryService } from '@lib/grpc-client/balance-transfer-history/balance-transfer-history.service'
import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common'
import {
  ListBalanceTransferRequest,
  BalanceTransfer,
} from '@lib/grpc-client/balance-transfer-history/balance-transfer-history.dto'
import { UserService } from '@lib/grpc-client/user'
import { plainToInstance } from 'class-transformer'

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class ApiBalanceTransferHistoryService {
  constructor(
    private grpcBalanceTransferHistoryService: GrpcBalanceTransferHistoryService,
    private userService: UserService,
  ) {}

  async listBalanceTransferHistory(params: ListBalanceTransferRequest) {
    const users = {}
    const result =
      await this.grpcBalanceTransferHistoryService.getListBalanceTransferHistory(
        params,
      )
    if (!result.data || result.data.length === 0) {
      return { data: [], pagination: result.pagination }
    }
    let userIds = result.data.map((item) => item.userIdFrom)
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
        email: users[item.userIdFrom] ?? null,
      }
    })
    return {
      data: plainToInstance(BalanceTransfer, data),
      pagination: result.pagination,
    }
  }

  async getAllBalanceTransferHistory(params: ListBalanceTransferRequest) {
    const GET_ALL_LIMIT_PAGE = 20000
    params.page = 1
    params.size = GET_ALL_LIMIT_PAGE

    const users = {}
    const data = []

    // 1. get data first page
    const resultFirstPage =
      await this.grpcBalanceTransferHistoryService.getListBalanceTransferHistory(
        params,
      )
    if (!resultFirstPage.data || resultFirstPage.data.length === 0) {
      return []
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
        await this.grpcBalanceTransferHistoryService.getListBalanceTransferHistory(
          params,
        )
      data.push(...resultEachPage.data)
    }

    // 4. get list users by ids
    let userIds = data.map((item) => item.userIdFrom)
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
        email: users[item.userIdFrom] ?? null,
      }
    })

    return plainToInstance(BalanceTransfer, dataWithEmail)
  }
}
