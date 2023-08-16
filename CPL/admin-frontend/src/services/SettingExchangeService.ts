import { clearParams, sortPairFn } from '@/core/helpers/util'
import ApiService from '@/core/services/ApiService'
import { BodyGeneric } from '@/models/common/MasterData'
import { BotParams, BotSettingItem } from '@/models/setting-exchange/BotSetting'
import {
  CategoryList,
  CreateBigCategory,
  CreateSubCategory,
  DeleteSubCategory,
  SubCategorySetting,
  UpdateOrderCategoryRequestDto,
  UpdateOrderCategoryResponse,
  UpdateOrderSubCategoryRequestDto,
  UpdateOrderSubCategoryResponse,
  UpdateSubCategory,
} from '@/models/setting-exchange/CategorySetting'
import {
  GetListCoinName,
  GetListCoinNameResponse,
} from '@/models/setting-exchange/CoinSetting'
import { GetListLanguageRequest } from '@/models/setting-exchange/Language'
import {
  CoinCurrencyItem,
  PairItem,
  PairList,
} from '@/models/setting-exchange/TradingPair'
import { AxiosResponse } from 'axios'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { MultiLanguageService } from './MultiLanguageService'

export class SettingExchangeService {
  public static async getPairList(
    params,
    sort = true,
  ): Promise<BodyGeneric<PairList>> {
    const payload = clearParams(params)
    const dataPair = await ApiService.get(`/api-exchange-setting/pair`, {
      params: payload,
    })
    if (sort) {
      dataPair.data.data.sort((a, b) => {
        const pair1 = [a.coin, a.currency]
        const pair2 = [b.coin, b.currency]
        return sortPairFn(pair1, pair2) as any
      })
    }

    return dataPair
  }

  public static async getListPairName(): Promise<
    BodyGeneric<CoinCurrencyItem>
  > {
    const dataPair = await ApiService.get(
      `/api-exchange-setting/list-pair-name`,
    )
    dataPair.data.data.sort((a, b) => {
      const pair1 = [a.coin, a.currency]
      const pair2 = [b.coin, b.currency]
      return sortPairFn(pair1, pair2) as any
    })

    return dataPair
  }

  public static async getListCoinName(
    params: GetListCoinName,
  ): Promise<AxiosResponse<GetListCoinNameResponse>> {
    return await ApiService.get(`/api-exchange-setting/list-coin-name`, {
      params: clearParams(params),
    })
  }

  public static async patchPairSetting(body: PairItem): Promise<any> {
    const pairData = await ApiService.patch(`/api-exchange-setting/pair`, body)
    return pairData
  }

  public static async postPairSetting(body: PairItem): Promise<any> {
    const pairData = await ApiService.post(`/api-exchange-setting/pair`, body)
    return pairData
  }

  public static async getCategoryList(
    params,
  ): Promise<AxiosResponse<CategoryList>> {
    const payload = clearParams(params)
    const response = await ApiService.get(
      `/api-exchange-setting/pair-category`,
      {
        params: payload,
      },
    )
    return response
  }

  public static async patchCategorySetting(
    body: CreateBigCategory,
  ): Promise<any> {
    return await ApiService.patch(`/api-exchange-setting/pair-category`, body)
  }

  public static async postCategorySetting(
    body: CreateBigCategory,
  ): Promise<any> {
    const categoryData = await ApiService.post(
      `/api-exchange-setting/pair-category`,
      body,
    )
    return categoryData
  }

  public static async deleteSubCategorySetting(
    params: DeleteSubCategory,
  ): Promise<AxiosResponse<{ status: boolean }>> {
    return ApiService.delete('/api-exchange-setting/sub-pair-category', {
      params,
    })
  }

  public static async patchSubCategorySetting(
    body: UpdateSubCategory,
  ): Promise<AxiosResponse<SubCategorySetting>> {
    return ApiService.patch<SubCategorySetting>(
      '/api-exchange-setting/sub-pair-category',
      body,
    )
  }

  public static async patchOrderSubCategorySetting(
    body: UpdateOrderSubCategoryRequestDto,
  ): Promise<AxiosResponse<UpdateOrderSubCategoryResponse>> {
    return ApiService.patch<UpdateOrderSubCategoryResponse>(
      '/api-exchange-setting/order-sub-pair-category',
      body,
    )
  }

  public static async createSubCategorySetting(
    body: CreateSubCategory,
  ): Promise<AxiosResponse<SubCategorySetting>> {
    return ApiService.post<SubCategorySetting>(
      '/api-exchange-setting/sub-pair-category',
      body,
    )
  }

  public static async patchOrderCategorySetting(
    body: UpdateOrderCategoryRequestDto,
  ): Promise<AxiosResponse<UpdateOrderCategoryResponse>> {
    return ApiService.patch<UpdateOrderCategoryResponse>(
      '/api-exchange-setting/order-pair-category',
      body,
    )
  }

  public static async deleteCategorySetting(
    params: any,
  ): Promise<AxiosResponse<{ status: boolean }>> {
    const categoryData = await ApiService.delete(
      `/api-exchange-setting/pair-category`,
      {
        params,
      },
    )
    return categoryData
  }

  public static async getCategoryItem(params: { id: string }): Promise<any> {
    return await ApiService.get(`/api-exchange-setting/pair-category-item`, {
      params,
    })
  }

  public static async scanErc20(address: string): Promise<any> {
    return await ApiService.get(`/erc20-contract-information`, {
      params: { contract_address: address },
    })
  }

  public static getLanguage(request: GetListLanguageRequest) {
    return MultiLanguageService.getTranslates(
      instanceToPlain(request, { exposeDefaultValues: true }),
    )
  }

  public static getCategoryTranslates() {
    return MultiLanguageService.getPairCategoriesKey()
  }

  public static getTranslatesByKeys(request: { keys: string[] }) {
    return MultiLanguageService.getTranslatesByKeys(request)
  }

  public static getCodeLanguage(request) {
    return MultiLanguageService.getCodeLanguages(request)
  }

  public static setLanguage(params): Promise<any> {
    return ApiService.post(`api-language/set-by-key`, params)
  }

  public static async getBotList(params) {
    const payload = plainToInstance(BotParams, clearParams(params))
    return await ApiService.get(`/obm-bot`, {
      params: payload,
    })
  }

  public static async updateBotSetting(body: BotSettingItem) {
    const botData = await ApiService.put(`/obm-bot`, body)
    return botData
  }

  public static async createBotSetting(body: { email: string }) {
    const botData = await ApiService.post(`/obm-bot/create`, body)
    return botData
  }
}
