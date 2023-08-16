import ApiService from '@/core/services/ApiService'
import { BodyGeneric } from '@/models/common/MasterData'
import {
  MarketMakerPair,
  DataPointItem,
  DataPointParams,
  DataPointResponse,
  GetMarketMakerSetting,
  MarketMakerSettingItem,
  MarketMakerSettingItemV2,
  MarketMakerSystemTargetParams,
  OrderPairProcess,
  PairInfoMarketMaker,
  UpdateMakerMakerSettings,
} from '@/models/market-maker/DataPoint'

export class MarketMakerService {
  public static async uploadFile(
    pair: PairInfoMarketMaker,
    file: any,
    vesion?: string,
  ): Promise<BodyGeneric<DataPointItem[]>> {
    const { coin, currency } = pair
    const data = await ApiService.post(
      `/market-maker/import-file${
        vesion ? `-${vesion}` : ''
      }/${coin}-${currency}`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return data
  }

  public static async uploadOrderFile(
    pair: PairInfoMarketMaker,
    file: any,
  ): Promise<BodyGeneric<DataPointItem[]>> {
    const { coin, currency } = pair
    const data = await ApiService.post(
      `/market-maker/import-order/${coin}-${currency}`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return data
  }

  public static async getDataPoints(
    params: DataPointParams,
    vesion?: string,
  ): Promise<BodyGeneric<DataPointResponse>> {
    return await ApiService.get(
      `/market-maker/data-points${vesion ? `-${vesion}` : ''}`,
      { params },
    )
  }

  public static async getSettings(
    params: PairInfoMarketMaker,
  ): Promise<BodyGeneric<MarketMakerSettingItem>> {
    return await ApiService.get(`/market-maker/settings-admin`, { params })
  }

  public static async putSettings(body: MarketMakerSettingItem) {
    const pairData = await ApiService.put(`/market-maker/update-settings`, body)
    return pairData
  }

  public static async getImportOrderProcess(
    params: PairInfoMarketMaker,
  ): Promise<BodyGeneric<OrderPairProcess>> {
    return await ApiService.get(`/market-maker/import-order-status`, {
      params,
    })
  }

  public static toArrayBuffer(buffer: ArrayBuffer): Array<Array<string>> {
    const data = buffer
      .toString() // convert Buffer to string
      .split('\n') // split string to lines
      .map((e) => e.trim()) // remove white spaces for each line
      .map((e) => e.split(',').map((e) => e.trim()))
    return data
  }

  public static validateRecord(data: Array<string>): boolean {
    const [timePoint, valuePoint] = data
    if (isNaN(new Date(timePoint).getTime())) return false
    if (!this.isNumeric(valuePoint)) return false
    return true
  }

  public static isNumeric(str: string | number) {
    if (typeof str != 'string') return false // we only process strings!
    return (
      !isNaN(+str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ) // ...and ensure strings of whitespace fail
  }

  public static removeRecordEmpty(
    data: Array<Array<string>>,
  ): Array<Array<string>> {
    return data.filter((item: Array<string>) => {
      let check = true
      for (const ele of item) {
        if (!ele) {
          check = false
          break
        }
      }
      return check
    })
  }

  public static async getSystemTarget(params: MarketMakerSystemTargetParams) {
    return await ApiService.get(`/market-maker/system-target`, { params })
  }

  public static async addMarketMakerPair(body: MarketMakerPair) {
    return await ApiService.post(`/market-maker/pair`, body)
  }

  public static async deleteMarketMakerPair(params: MarketMakerPair) {
    return await ApiService.delete(`/market-maker/pair`, {
      params,
    })
  }

  public static async updateMarketMakerSettings(
    body: UpdateMakerMakerSettings,
  ) {
    return await ApiService.put(`/market-maker/pair-settings`, body)
  }

  public static async getSettingV2(
    params: GetMarketMakerSetting,
  ): Promise<BodyGeneric<MarketMakerSettingItemV2>> {
    return await ApiService.get(`/market-maker/setting-v2`, { params })
  }

  public static async putSettingV2(
    request: MarketMakerSettingItemV2,
  ): Promise<BodyGeneric<MarketMakerSettingItemV2>> {
    return await ApiService.put(`/market-maker/setting-v2`, request)
  }
}
