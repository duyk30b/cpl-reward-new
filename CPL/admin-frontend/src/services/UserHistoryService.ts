import ApiService from '@/core/services/ApiService'

export class UserHistoryService {
  public static async getListLoginHistories(params) {
    return await ApiService.get(`/history/login`, { params: params })
  }

  public static async getListEmailChangeHistories(params) {
    return await ApiService.get(`/history/email-change`, { params: params })
  }
}
