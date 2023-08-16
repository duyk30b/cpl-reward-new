import ApiService from '@/core/services/ApiService'
import {
  ListSwapSettingRequest,
  SwapSettingResultDto,
  CreateSwapSettingRequest,
  UpdateSwapSettingRequest,
} from '@/views/apps/swap-setting/definition/swap-setting.dto'

export class SwapSettingService {
  public static async getPairs(): Promise<any> {
    const response = await ApiService.get(
      `/api-exchange-setting/list-pair-name`,
    )
    return response?.data?.data ?? []
  }
  public static async getSwapSettingByModule(
    params: Partial<ListSwapSettingRequest>,
  ): Promise<SwapSettingResultDto> {
    const response = await ApiService.get(`/balance-convert-setting`, {
      params,
    })
    return response.data
  }

  public static async createSwapSetting(
    body: CreateSwapSettingRequest,
  ): Promise<any> {
    const response = await ApiService.post(`/balance-convert-setting`, body)
    return response.data
  }

  public static async updateSwapSetting(
    id: string,
    body: UpdateSwapSettingRequest,
  ): Promise<any> {
    const response = await ApiService.patch(
      `/balance-convert-setting/${id}`,
      body,
    )
    return response.data
  }

  public static async deleteSwapSetting(id: string): Promise<any> {
    const response = await ApiService.post(
      `/balance-convert-setting/${id}/delete`,
      null,
    )
    return response.data
  }
}
