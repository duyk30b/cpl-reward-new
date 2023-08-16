import ApiService from '@/core/services/ApiService'
import {
  ListBalanceTransferRequest,
  ListBalanceTransferResponse,
  BalanceTransfer,
} from '@/views/apps/balance-transfer-history/definition/balance-transfer-history.dto'
import { plainToInstance } from 'class-transformer'

export class BalanceTransferHistoryService {
  public static async listBalanceTransferHistory(
    params: ListBalanceTransferRequest,
  ): Promise<ListBalanceTransferResponse> {
    const response = await ApiService.get(`/transfer-history`, {
      params,
    })
    return plainToInstance(ListBalanceTransferResponse, response.data)
  }

  public static async getAllUserBalanceChangeHistory(
    params: ListBalanceTransferRequest,
  ): Promise<any> {
    const response = await ApiService.get(`/transfer-history/get-all`, {
      params,
    })
    return response.data
  }
}
