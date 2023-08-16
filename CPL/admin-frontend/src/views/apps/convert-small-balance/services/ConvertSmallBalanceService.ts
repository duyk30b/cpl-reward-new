import ApiService from '@/core/services/ApiService'
import {
  ConvertSmallBalance,
  ConvertSmallBalanceLog,
  ConvertSmallBalanceListResultDto,
  ConvertSmallBalanceListLogResultDto,
  ListConvertSmallBalanceRequest,
  CreateConvertSmallBalanceRequest,
  UpdateConvertSmallBalanceRequest,
  Coin,
  BalanceConvertSmallHistoryRequest,
  ConvertSmallBalanceHistoryDto,
  BalanceConvertSmallHistoryDetail,
} from '@/views/apps/convert-small-balance/definition/convert-small-balance.dto'
import { HttpStatus } from '@/core/variables/common.enum'

export class ConvertSmallBalanceService {
  public static async getAllConvertSmallBalance(
    params: Partial<ListConvertSmallBalanceRequest>,
  ): Promise<ConvertSmallBalanceListResultDto> {
    const response = await ApiService.get(`/balance-convert-setting`, {
      params,
    })
    return response.data
  }

  public static async getDetailConvertSmallBalance(
    id: number | string,
  ): Promise<ConvertSmallBalance> {
    const response = await ApiService.get(`/balance-convert-setting/${id}`)
    return response.data
  }

  public static async getConvertSmallBalanceLogs(
    params: ConvertSmallBalanceLog,
  ): Promise<ConvertSmallBalanceListLogResultDto> {
    const response = await ApiService.get(`/balance-convert-setting/logs`, {
      params,
    })
    return response.data
  }

  public static async createConvertSmallBalance(
    body: CreateConvertSmallBalanceRequest,
  ): Promise<any> {
    const response = await ApiService.post(`/balance-convert-setting`, body)
    return response.data
  }

  public static async updateConvertSmallBalance(
    id: string,
    body: UpdateConvertSmallBalanceRequest,
  ): Promise<any> {
    const response = await ApiService.patch(
      `/balance-convert-setting/${id}`,
      body,
    )
    return response.data
  }

  public static async deleteConvertSmallBalance(id: string): Promise<any> {
    const response = await ApiService.post(
      `/balance-convert-setting/${id}/delete`,
      null,
    )
    return response.data
  }

  public static async getCoins(): Promise<Coin[]> {
    const response = await ApiService.get('/coin')
    if (response.status != HttpStatus.OK) {
      return []
    }
    return response.data
  }

  public static async listBalanceConvertSmall(
    params: BalanceConvertSmallHistoryRequest,
  ): Promise<ConvertSmallBalanceHistoryDto> {
    const response = await ApiService.get(`/convert-small`, {
      params,
    })
    return response.data
  }

  public static async getAllBalanceConvertSmall(
    params: BalanceConvertSmallHistoryRequest,
  ): Promise<any> {
    const response = await ApiService.get(`/convert-small/get-all`, {
      params,
    })
    return response.data
  }

  public static async listBalanceConvertSmallDetail(
    id: string,
  ): Promise<Array<BalanceConvertSmallHistoryDetail>> {
    const response = await ApiService.get(`/convert-small/${id}`)
    return response.data
  }

  public static async listBalanceConvertSmallDetailByIds(
    ids: string[],
  ): Promise<Array<BalanceConvertSmallHistoryDetail>> {
    const response = await ApiService.get(`/convert-small/get-detail-by-ids`, {
      params: {
        ids,
      },
    })
    return response.data
  }
}
