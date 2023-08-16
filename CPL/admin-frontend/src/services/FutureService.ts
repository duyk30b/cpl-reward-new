import { clearParams } from '@/core/helpers/util'
import ApiService from '@/core/services/ApiService'
import { plainToInstance } from 'class-transformer'
import { FutureSetting } from '@/models/future/FutureSetting'
import _ from 'lodash'

export class FutureService {
  public static async getOpenOrderList(params) {
    const payload = clearParams(params)
    return await ApiService.get(`/api-futures/open-order`, {
      params: payload,
    })
  }

  public static async cancelOrder(body: { order_id: string[] }) {
    return ApiService.post(`/api-futures/open-order/cancel`, body)
  }

  public static async getOrderHistoryList(params) {
    const payload = clearParams(params)
    return await ApiService.get(`/api-futures/order-history`, {
      params: payload,
    })
  }

  public static async getOpenPositionList(params) {
    const payload = clearParams(params)
    return await ApiService.get(`/api-futures/open-position`, {
      params: payload,
    })
  }

  public static async getSettings(params) {
    const payload = clearParams(params)
    return await ApiService.get(`/api-futures/get-settings`, {
      params: payload,
    })
  }

  public static async getSingleSetting(coin: string, currency: string) {
    const result = await ApiService.get(
      `/api-futures/get-setting/${coin}/${currency}`,
    )
    return _.isEmpty(result.data)
      ? null
      : plainToInstance(FutureSetting, result.data)
  }

  public static async setupSetting(credentials) {
    return ApiService.post(`/api-futures/setup-setting`, credentials)
  }

  public static async deleteSetting(coin: string, currency: string) {
    return ApiService.delete(`/api-futures/delete-setting/${coin}/${currency}`)
  }

  public static async updateStatusPairs(credentials) {
    return ApiService.post(`/api-futures/update-status-all-pairs`, credentials)
  }
}
