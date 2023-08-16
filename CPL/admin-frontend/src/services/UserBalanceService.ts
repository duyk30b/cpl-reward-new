import ApiService from '@/core/services/ApiService'
import moment from 'moment'

export class UserBalanceService {
  public static async getBalanceSummary() {
    return await ApiService.get('/bo/user-balances/summary')
  }

  public static async getBalanceUsers(params) {
    if (params.search_text) {
      params.search_text = params.search_text.trim()
    }
    return await ApiService.get('/bo/user-balances', { params })
  }

  public static async getListBalance(id, params?) {
    return await ApiService.get('/balance-account/' + id, { params })
  }

  public static async updateUserBalance(param) {
    return await ApiService.post('/transaction/create', param)
  }

  public static async getTransferBalance(params) {
    return await ApiService.get('/balance-transfer/list', { params })
  }

  public static async transferBalance(params) {
    return await ApiService.post('/balance-transfer/transfer', params)
  }

  public static async getBalanceHistory(params) {
    return await ApiService.get('/balance-history/list', { params })
  }

  public static async downloadBalanceHistory(params) {
    const fileName = `balance-histories-${params?.user_id}-${moment().format(
      'YYYY-MM-DD HH:mm:ss',
    )}.csv`
    return await ApiService.getAndDownload(
      '/balance-history/list/csv',
      {
        params,
      },
      fileName,
    )
  }

  public static async getDiffBalanceCorrect(params) {
    return await ApiService.get('/balance-monitor/get-diff-balance-correct', {
      params,
    })
  }

  public static async getAbnormalBalanceUsers(params) {
    return await ApiService.get('/balance-monitor/abnormal-balance-users', {
      params,
    })
  }

  public static async getAbnormalBalanceList(id, params?) {
    return await ApiService.get(
      '/balance-monitor/' + id + '/abnormal-balance-accounts',
      {
        params,
      },
    )
  }

  public static async getAbnormalBalanceHistory(params) {
    return await ApiService.get('/balance-monitor/abnormal-balance-histories', {
      params,
    })
  }

  public static async downloadAbnormalBalanceHistory(params) {
    const fileName = `abnormal-balance-histories-${
      params?.user_id
    }-${moment().format('YYYY-MM-DD HH:mm:ss')}.csv`
    return await ApiService.getAndDownload(
      '/balance-monitor/abnormal-balance-histories/csv',
      {
        params,
      },
      fileName,
    )
  }

  public static async correctAbnormalBalance(params) {
    return await ApiService.post('/balance-monitor/correct', params)
  }

  public static async checkBalanceInvalid(params) {
    return await ApiService.post(
      '/balance-monitor/check-balance-invalid',
      params,
    )
  }
}
