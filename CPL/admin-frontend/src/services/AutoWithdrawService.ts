import ApiService from '@/core/services/ApiService'

export class AutoWithdrawService {
  public static async getCurrencyList() {
    return await ApiService.get(`/withdraw/currency`)
  }

  public static async getAutoWithdrawGroup(params) {
    return await ApiService.get(`/withdraw/withdraw-group`, { params })
  }

  public static async createAutoWithdrawGroup(data) {
    return await ApiService.post(`/withdraw/withdraw-group`, data)
  }

  public static async deleteAutoWithdrawGroup(id) {
    return await ApiService.delete(`/groups/${id}`)
  }

  public static async getTransactions(params) {
    return await ApiService.get(`withdraw/auto-withdraw`, { params })
  }

  public static async saveTransactions(data) {
    return await ApiService.put(`/withdraw/auto-withdraw`, data)
  }

  public static async sendProcessTransactions(data) {
    return await ApiService.put(`/withdraw/withdraw-group`, data)
  }

  public static async getDetailTransactions(data) {
    return await ApiService.post(`/withdraw/transaction`, data)
  }

  public static async validateTransactions(data) {
    return await ApiService.post(`/withdraw/validate-transaction-ids`, data)
  }

  public static async collectGroup(groupId) {
    return await ApiService.post(`withdraw/${groupId}/collection`, null)
  }
}
