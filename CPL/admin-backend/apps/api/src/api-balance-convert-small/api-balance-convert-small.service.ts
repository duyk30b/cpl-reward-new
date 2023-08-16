import { BalanceConvertSmallService as GrpcBalanceConvertSmallService } from '@lib/grpc-client/balance-convert-small/balance-convert-small.service'
import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common'
import {
  ListBalanceConvertSmallRequest,
  BalanceConvertSmall,
  BalanceConvertSmallDetail,
} from '@lib/grpc-client/balance-convert-small/balance-convert-small.dto'
import { UserService } from '@lib/grpc-client/user'
import { plainToInstance } from 'class-transformer'

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class ApiBalanceConvertSmallService {
  constructor(
    private grpcBalanceConvertSmallService: GrpcBalanceConvertSmallService,
    private userService: UserService,
  ) {}

  async listBalanceConvertSmall(params: ListBalanceConvertSmallRequest) {
    const users = {}
    const result =
      await this.grpcBalanceConvertSmallService.getListBalanceConvertSmall(
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
    return {
      data: plainToInstance(BalanceConvertSmall, data),
      pagination: result.pagination,
    }
  }

  async detailBalanceConvertSmall(id: string) {
    const users = {}
    const result =
      await this.grpcBalanceConvertSmallService.getDetailBalanceConvertSmall({
        convertSmallId: id,
      })

    if (result.length === 0) {
      return []
    }
    let userIds = result.map((item) => item.userId)
    userIds = Array.from(new Set(userIds))
    const listUsers = await this.userService.findByIds(userIds)
    if (Object.keys(listUsers).length > 0) {
      for (const user of listUsers) {
        users[user.id] = user.email
      }
    }
    const data = result.map((item) => {
      return {
        ...item,
        email: users[item.userId] ?? null,
      }
    })
    return plainToInstance(BalanceConvertSmallDetail, data)
  }

  async getAllBalanceConvertSmall(params: ListBalanceConvertSmallRequest) {
    const GET_ALL_LIMIT_PAGE = 20000
    params.page = 1
    params.size = GET_ALL_LIMIT_PAGE

    const users = {}
    const data = []

    // 1. get data first page
    const resultFirstPage =
      await this.grpcBalanceConvertSmallService.getListBalanceConvertSmall(
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
        await this.grpcBalanceConvertSmallService.getListBalanceConvertSmall(
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

    return plainToInstance(BalanceConvertSmall, dataWithEmail)
  }

  async detailBalanceConvertSmallByIds(ids: string[]) {
    const users = {}
    const result =
      await this.grpcBalanceConvertSmallService.getDetailBalanceConvertSmallByIds(
        {
          convertSmallIds: ids,
        },
      )

    if (!result || result?.length === 0) {
      return []
    }
    let userIds = result.map((item) => item.userId)
    userIds = Array.from(new Set(userIds))
    const listUsers = await this.userService.findByIds(userIds)
    if (Object.keys(listUsers).length > 0) {
      for (const user of listUsers) {
        users[user.id] = user.email
      }
    }

    const data = result.map((item) => {
      return {
        ...item,
        email: users[item.userId] ?? null,
      }
    })
    return plainToInstance(BalanceConvertSmallDetail, data)
  }
}
