import ApiService from '@/core/services/ApiService'
import {
  Currency,
  BalanceChangeHistoryRequest,
  BalanceChangeHistoryResponse,
} from '@/views/apps/history/user-balance-change-history/balance.interface'
import { HttpStatus } from '@/core/variables/common.enum'

export class UserBalanceChangeService {
  public static async getUserBalanceChangeHistories(
    params: BalanceChangeHistoryRequest,
  ): Promise<BalanceChangeHistoryResponse> {
    const response = await ApiService.get(
      `/transaction/user-balance-change-history`,
      {
        params,
      },
    )
    return response.data
  }

  public static async getAllUserBalanceChangeHistories(
    params: BalanceChangeHistoryRequest,
  ): Promise<BalanceChangeHistoryResponse> {
    const response = await ApiService.get(
      `/transaction/get-all-balance-change-history`,
      {
        params,
      },
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
}
