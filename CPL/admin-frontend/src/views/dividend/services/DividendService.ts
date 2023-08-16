import ApiService from '@/core/services/ApiService'
import {
  GetDividendListRequest,
  DividendAPIResponse,
  GetDividendCodesRequest,
  GetDividendHistoriesRequest,
  ReviewCodeRequest,
  GetDividendNamesRequest,
} from '@/views/dividend/definition/dividend.dto'
import { instanceToPlain } from 'class-transformer'
import { Currency } from '@/views/dividend/definition/dividend.interface'
import { STATUS } from '@/views/dividend/definition/dividend.enum'
import { HttpStatus } from '@/core/variables/common.enum'

export class DividendService {
  public static async getDividends(
    params: Partial<GetDividendListRequest>,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/campaigns`, {
      params,
    })
    return response.data
  }

  public static async getDividendCampaigns(): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/campaign-names`, {
      params: {
        excluded_statuses: `${STATUS.CANCELLED},${STATUS.FINISHED}`,
      },
    })
    return response.data
  }

  public static async getDividendCampaignsAdvanced(
    params: Partial<GetDividendNamesRequest>,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/campaign-names-advanced`, {
      params,
    })
    return response.data
  }

  public static async getDividendDetail(
    id: number,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/campaigns/${id}`)
    return response.data
  }

  public static async getDividendAdvanced(
    id: number,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.get(
      `/dividend/campaigns/${id}/statistics`,
    )
    return response.data
  }

  public static async getDividendNamesWithCancel() {
    const response = await ApiService.get(`/dividend/campaign-names`)
    return response.data
  }

  public static async createDividend(body) {
    const response = await ApiService.post(
      `/dividend/campaigns`,
      instanceToPlain(body),
    )
    return response.data
  }

  public static async editDividend(body) {
    const response = await ApiService.put(
      `/dividend/campaigns/update`,
      instanceToPlain(body),
    )
    return response.data
  }

  public static async cancelDividend(body) {
    const response = await ApiService.post(
      `/dividend/campaigns/cancel`,
      instanceToPlain(body),
    )
    return response.data
  }

  public static async getListCurrency(): Promise<Currency[]> {
    const response = await ApiService.get('/coin')
    if (response.status != HttpStatus.OK) {
      return []
    }
    return response.data
  }

  public static async getDividendWithoutId(id: string) {
    const response = await ApiService.get(`/dividend/campaign-names`, {
      params: {
        excluded_ids: id,
      },
    })
    return response.data
  }

  public static async getDividendCodes(
    params: GetDividendCodesRequest,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/codes`, {
      params,
    })
    return response.data
  }

  public static async getDividendNames(): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/campaign-names`, {
      params: {
        excluded_statuses: STATUS.CANCELLED,
      },
    })
    return response.data
  }

  public static async toggleDividendCodes(data): Promise<DividendAPIResponse> {
    const response = await ApiService.post(
      `/dividend/codes/toggle-disability`,
      data,
    )
    return response.data
  }

  public static async createCodes(data): Promise<DividendAPIResponse> {
    const response = await ApiService.post(`/dividend/codes`, data)
    return response.data
  }

  public static async getHistories(
    params: GetDividendHistoriesRequest,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/histories`, { params })
    return response.data
  }

  public static async getUsersDisableDividend(
    params,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/disabled-users`, {
      params,
    })
    return response.data
  }

  public static async disableUserDividend(
    id: number,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.post(`/dividend/disabled-users`, { id })
    return response.data
  }

  public static async deleteDisableUserDividend(
    id: number,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.post(`/dividend/disabled-users/delete`, {
      id,
    })
    return response.data
  }

  public static async reviewCode(
    params: ReviewCodeRequest,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/codes/review`, {
      params,
    })
    return response.data
  }

  public static async activeCode(
    body: ReviewCodeRequest,
  ): Promise<DividendAPIResponse> {
    const response = await ApiService.post(`/dividend/codes/active`, body)
    return response.data
  }

  public static async deleteCode(code: string): Promise<DividendAPIResponse> {
    const response = await ApiService.post(`/dividend/codes/delete`, {
      code,
    })
    return response.data
  }

  public static async getCodesOfUser(id: number): Promise<DividendAPIResponse> {
    const response = await ApiService.get(`/dividend/user-codes/${id}`)
    return response.data
  }
}
