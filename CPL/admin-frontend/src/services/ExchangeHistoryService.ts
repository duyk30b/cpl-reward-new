import { clearParams } from '@/core/helpers/util'
import ApiService from '@/core/services/ApiService'
import { BodyGeneric } from '@/models/common/MasterData'
import {
  UserItem,
  UserItems,
  UserParam,
} from '@/models/exchange-history/BlacklistUser'
import {
  GetListOpenOrderResponse,
  OpenOrderParams,
  OrderBookParams,
  OrderItem,
} from '@/models/exchange-history/OpenOrder'
import {
  GetListOpenHistoryResponse,
  OrderHistoryParams,
} from '@/models/exchange-history/OrderHistory'
import {
  ExportTradeHistoryResponse,
  GetListTradeHistoryResponse,
  TradeHistoryParams,
} from '@/models/exchange-history/TradeHistory'
import { UpdateUserZeroFee } from '@/models/exchange-history/ZeroFeeUser'
import { PairList } from '@/models/setting-exchange/TradingPair'
import { AxiosResponse } from 'axios'
import { plainToInstance } from 'class-transformer'

export class ExchangeHistoryService {
  public static async getPairList(): Promise<BodyGeneric<PairList>> {
    return await ApiService.get(`/api-exchange-setting/pair`)
  }

  public static async getOrderBookList(params: OrderBookParams): Promise<any> {
    const dataOrderbook = await ApiService.get(`/api-exchange/orderbook`, {
      params,
    })
    return {
      current_price: dataOrderbook?.data?.data?.current_price,
      buy: plainToInstance(
        OrderItem,
        (dataOrderbook?.data?.data?.orderbook?.bids as OrderItem[]) || [],
      ),
      sell: plainToInstance(
        OrderItem,
        (dataOrderbook?.data?.data?.orderbook?.asks as OrderItem[]) || [],
      ),
    }
  }

  public static async getOpenOrderList(
    params: OpenOrderParams,
  ): Promise<AxiosResponse<GetListOpenOrderResponse>> {
    const payload = clearParams(params)
    return await ApiService.get(`/api-exchange/order`, {
      params: plainToInstance(OpenOrderParams, payload, {
        excludeExtraneousValues: true,
      }),
    })
  }

  public static async exportOpenOrder(
    params: OpenOrderParams,
  ): Promise<AxiosResponse<ExportTradeHistoryResponse>> {
    const payload = clearParams(params)
    return await ApiService.get<ExportTradeHistoryResponse>(
      `/api-exchange/export-open-order`,
      {
        params: plainToInstance(OpenOrderParams, payload, {
          excludeExtraneousValues: true,
        }),
      },
    )
  }

  public static async cancelOrder(body: { order_ids: string[] }): Promise<any> {
    const orderData = await ApiService.post(`/api-exchange/order/cancel`, body)
    return orderData
  }

  public static async getOrderHistoryList(
    params: OrderHistoryParams,
  ): Promise<AxiosResponse<GetListOpenHistoryResponse>> {
    if (params.status && parseInt(params.status) === 10) {
      params.status = '3'
      params.resources = '2,3'
    }
    const payload = clearParams(params)
    return await ApiService.get(`/api-exchange/order-history`, {
      params: plainToInstance(OrderHistoryParams, payload, {
        excludeExtraneousValues: true,
      }),
    })
  }

  public static async getTradeHistoryList(
    params: TradeHistoryParams,
  ): Promise<AxiosResponse<GetListTradeHistoryResponse>> {
    const payload = clearParams(params)
    return await ApiService.get(`/api-exchange/trade-history`, {
      params: plainToInstance(TradeHistoryParams, payload, {
        excludeExtraneousValues: true,
      }),
    })
  }

  public static async exportTradeHistory(
    params: TradeHistoryParams,
  ): Promise<AxiosResponse<ExportTradeHistoryResponse>> {
    const payload = clearParams(params)
    return await ApiService.get<ExportTradeHistoryResponse>(
      `/api-exchange/export-trade-history`,
      {
        params: plainToInstance(TradeHistoryParams, payload, {
          excludeExtraneousValues: true,
        }),
      },
    )
  }

  public static getBlacklistUser(
    params: UserParam,
  ): Promise<BodyGeneric<UserItems>> {
    return ApiService.get(`/api-exchange/black-list`, { params })
  }

  public static addBlacklistUser(params: UserItem): Promise<any> {
    return ApiService.post(`/api-exchange/black-list`, params)
  }

  public static updateBlacklistUser(params: UserItem): Promise<any> {
    return ApiService.patch(`/api-exchange/black-list`, params)
  }

  public static deleteBlacklistUser(id: string): Promise<any> {
    return ApiService.delete(`/api-exchange/black-list?user_id=` + id)
  }

  public static getUserByEmail(params) {
    return ApiService.get(`/user`, { params })
  }

  public static getUnlimitedUser(
    params: UserParam,
  ): Promise<BodyGeneric<UserItems>> {
    return ApiService.get(`/api-exchange/user-unlimited`, { params })
  }

  public static addUnlimitedUser(params: UserItem): Promise<any> {
    return ApiService.post(`/api-exchange/user-unlimited`, params)
  }

  public static updateUnlimitedUser(params: UserItem): Promise<any> {
    return ApiService.patch(`/api-exchange/user-unlimited`, params)
  }

  public static deleteUnlimitedUser(id: string): Promise<any> {
    return ApiService.delete(`/api-exchange/user-unlimited?user_id=` + id)
  }

  public static getZeroFeeUser(
    params: UserParam,
  ): Promise<BodyGeneric<UserItems>> {
    return ApiService.get(`/api-exchange/user-zero-fee`, { params })
  }

  public static updateZeroFeeUser(params: UpdateUserZeroFee): Promise<any> {
    return ApiService.patch(`/api-exchange/user-zero-fee`, params)
  }
}
