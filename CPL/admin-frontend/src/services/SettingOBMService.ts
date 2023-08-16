import ApiService from '@/core/services/ApiService'
import { BodyGeneric } from '@/models/common/MasterData'
import {
  DeletePairItem,
  ObmExchangeSettingDTO,
  ObmExchangeSettingItemDTO,
  ObmPairSettingDTO,
  ObmPairSettingItemDTO,
  PairOBMDataParam,
  PairThreshold,
  PropertyShow,
} from '@/models/setting-obm/GeneralOBM'

export class SettingOBMService {
  public static async getObmPairList(): Promise<
    BodyGeneric<ObmPairSettingDTO>
  > {
    return await ApiService.get(`/obm-setting/pair-active`)
  }

  public static async getObmExchangeList(): Promise<
    BodyGeneric<ObmExchangeSettingDTO>
  > {
    return await ApiService.get(`/obm-setting/exchange`)
  }

  public static async getObmThresholdList(): Promise<
    BodyGeneric<{ data: PairThreshold }>
  > {
    return await ApiService.get(`/obm-setting/threshold`)
  }

  public static async getObmPairData(
    params: PairOBMDataParam,
  ): Promise<BodyGeneric<{ data: PropertyShow }>> {
    return await ApiService.get(`/obm-setting/pair`, { params })
  }

  public static async patchPairOBMSetting(
    body: ObmPairSettingItemDTO[],
  ): Promise<any> {
    const pairData = await ApiService.put(`/obm-setting/pair`, {
      name: 'update_pair',
      data: body,
    })
    return pairData
  }

  public static async getSystemTarget(): Promise<BodyGeneric<any>> {
    return await ApiService.get(`/obm-setting/system-target`)
  }

  public static async saveExchangeSetting(
    body: ObmExchangeSettingItemDTO[],
  ): Promise<any> {
    const exchangeData = await ApiService.put(`/obm-setting/exchange`, {
      name: 'update_exchange',
      data: body,
    })
    return exchangeData
  }

  static clearParams(params) {
    return Object.keys(params).reduce((res, cur) => {
      if (params[cur]) res[cur] = params[cur]
      return res
    }, {})
  }

  public static async deletePairInExchange(body: DeletePairItem): Promise<any> {
    const pairData = await ApiService.put(`/obm-setting/delete-pair`, body)
    return pairData
  }
}
