import { BalanceSwapHistoryService as GrpcBalanceSwapHistoryService } from '@lib/grpc-client/balance-swap-history/balance-swap-history.service'
import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common'
import {
  ListBalanceSwapRequest,
  SwapEntity,
} from '@lib/grpc-client/balance-swap-history/balance-swap-history.dto'
import { UserService } from '@lib/grpc-client/user'
import { plainToInstance } from 'class-transformer'

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class ApiBalanceSwapHistoryService {
  constructor(
    private grpcBalanceSwapHistoryService: GrpcBalanceSwapHistoryService,
    private userService: UserService,
  ) {}

  async listBalanceSwapHistory(params: ListBalanceSwapRequest) {
    const users = {}
    const result =
      await this.grpcBalanceSwapHistoryService.getListBalanceSwapHistory(params)
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
    return {
      data: plainToInstance(SwapEntity, data),
      pagination: result.pagination,
    }
  }

  async getAllBalanceSwapHistory(params: ListBalanceSwapRequest) {
    const GET_ALL_LIMIT_PAGE = 20000
    params.page = 1
    params.size = GET_ALL_LIMIT_PAGE

    const users = {}
    const data = []

    // 1. get data first page
    const resultFirstPage =
      await this.grpcBalanceSwapHistoryService.getListBalanceSwapHistory(params)
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
        await this.grpcBalanceSwapHistoryService.getListBalanceSwapHistory(
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

    return plainToInstance(SwapEntity, dataWithEmail)
  }
}
