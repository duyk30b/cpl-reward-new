import ApiService from '@/core/services/ApiService'
import {
  ListBalanceSwapRequest,
  ListBalanceSwapResponse,
} from '@/views/apps/swap-setting/definition/swap-history.dto'
import { plainToInstance } from 'class-transformer'

export class SwapHistoryService {
  public static async listBalanceSwapHistory(
    params: ListBalanceSwapRequest,
  ): Promise<ListBalanceSwapResponse> {
    const response = await ApiService.get(`/swap-history`, {
      params,
    })
    return plainToInstance(ListBalanceSwapResponse, response.data)
  }

  public static async getAllUserBalanceChangeHistory(
    params: ListBalanceSwapRequest,
  ): Promise<any> {
    const response = await ApiService.get(`/swap-history/get-all`, {
      params,
    })
    return response.data
  }
}
