import { Injectable, Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { OpenPositionResponse } from './api-futures.dto'
import { FuturesSettingService } from '@lib/grpc-client/common-setting/futures-setting/futures-setting.service'
import {
  FuturesSetting,
  IDeleteSettingDto,
  IGetFuturesSettingDto,
  IGetSingleSettingDto,
  IUpdateStatusDto,
  ODeleteSettingResponse,
  OUpdateSettingResponse,
} from '@lib/grpc-client/common-setting/futures-setting/futures-setting.dto'
import * as _ from 'lodash'
import {
  CancelOrderRequest,
  CancelOrderResponse,
  OrderData,
  SearchOrderRequest,
} from '@lib/grpc-client/futures/integrate/futures-integrate.dto'
import { FuturesIntegrateService } from '@lib/grpc-client/futures/integrate/futures-integrate.service'
import { UserService } from '@lib/grpc-client/user'
import { GetPositionListRequest } from '@lib/grpc-client/futures/core/futures-core.dto'
import { FuturesCoreService } from '@lib/grpc-client/futures/core/futures-core.service'

@Injectable()
export class ApiFuturesService {
  protected readonly logger = new Logger(ApiFuturesService.name)

  constructor(
    private readonly futuresSettingService: FuturesSettingService,
    private readonly futuresIntegrateService: FuturesIntegrateService,
    private readonly futuresCoreService: FuturesCoreService,
    private readonly userService: UserService,
  ) {}

  async updateStatusPairs(
    updateStatusDto: IUpdateStatusDto,
  ): Promise<OUpdateSettingResponse> {
    if (_.isEmpty(updateStatusDto.statusPairs)) return { updated: 0 }

    return await this.futuresSettingService.updateStatusSetting(updateStatusDto)
  }

  async deleteSetting(
    setting: IDeleteSettingDto,
  ): Promise<ODeleteSettingResponse> {
    return this.futuresSettingService.deleteFuturesSetting(setting)
  }

  async createSetting(setting: FuturesSetting): Promise<FuturesSetting> {
    return this.futuresSettingService.setFuturesSetting(setting)
  }

  async getSettings(query: IGetFuturesSettingDto): Promise<FuturesSetting[]> {
    const result = await this.futuresSettingService.getSettings(query)
    if (result.data.length < 1) return [] as FuturesSetting[]
    return result.data
  }

  async getSingleSetting(input: IGetSingleSettingDto): Promise<FuturesSetting> {
    const result = await this.futuresSettingService.getSingleSetting(input)
    if (_.isEmpty(result)) return {} as FuturesSetting
    return result.data
  }

  private async getEmailFromUserIds(
    userIds: string[],
  ): Promise<Record<string, string>> {
    const users = {}
    const listUsers = await this.userService.findByIds(userIds)
    if (Object.keys(listUsers).length < 1) return users

    for (const user of listUsers) {
      users[user.id] = user.email
    }

    return users
  }

  public async getListOpenOrder(
    searchOrderRequest: SearchOrderRequest,
  ): Promise<OrderData> {
    const orders = await this.futuresIntegrateService.getList(
      searchOrderRequest,
    )
    if (orders.data.length < 1) return orders

    let userIds = []
    orders.data.forEach((order) => {
      userIds = _.union([...userIds, ...[order.userId]])
    })

    const users = await this.getEmailFromUserIds(userIds)

    const result = orders.data.map((order) => {
      return {
        ...order,
        email: users[order.userId] ?? null,
      }
    })

    return plainToInstance(
      OrderData,
      {
        data: result,
        pagination: orders.pagination,
      },
      { ignoreDecorators: true },
    )
  }

  public async cancelOrderByIds(
    cancelOrderRequest: CancelOrderRequest,
  ): Promise<CancelOrderResponse> {
    return this.futuresIntegrateService.cancelOrder(cancelOrderRequest)
  }

  public async getListOrderHistory(
    searchOrderRequest: SearchOrderRequest,
  ): Promise<OrderData> {
    const histories = await this.futuresIntegrateService.getListOrderHistories(
      searchOrderRequest,
    )
    if (histories.data.length < 1) return histories

    let userIds = []
    histories.data.forEach((order) => {
      userIds = _.union([...userIds, ...[order.userId]])
    })

    const users = await this.getEmailFromUserIds(userIds)

    const result = histories.data.map((order) => {
      return {
        ...order,
        email: users[order.userId] ?? null,
      }
    })

    return plainToInstance(
      OrderData,
      {
        data: result,
        pagination: histories.pagination,
      },
      { ignoreDecorators: true },
    )
  }

  public async getListOpenPosition(
    getPositionListRequest: GetPositionListRequest,
  ): Promise<OpenPositionResponse> {
    const data = await this.futuresCoreService.getPositionList(
      getPositionListRequest,
    )
    if (data.positions.length < 1)
      return plainToInstance(OpenPositionResponse, {
        data: [],
        pagination: {
          page: data.pagination.page,
          size: data.pagination.perPage,
          total: data.pagination.totalRows,
        },
      })

    let userIds = []
    data.positions.forEach((position) => {
      userIds = _.union([...userIds, ...[position.userId]])
    })

    const users = await this.getEmailFromUserIds(userIds)

    const result = data.positions.map((order) => {
      return {
        ...order,
        email: users[order.userId] ?? null,
      }
    })

    return plainToInstance(
      OpenPositionResponse,
      {
        data: result,
        pagination: {
          page: data.pagination.page,
          size: data.pagination.perPage,
          total: data.pagination.totalRows,
        },
        error: data.error,
      },
      { ignoreDecorators: true },
    )
  }
}
