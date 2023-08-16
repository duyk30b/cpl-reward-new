import ApiService from '@/core/services/ApiService'

export class WalletSettingService {
  public static async getWalletSetting(category) {
    return await ApiService.get(`api-hot-wallet/setting?category=${category}`)
  }

  public static async createWalletSetting(params) {
    return await ApiService.post(`api-hot-wallet/setting`, params)
  }

  public static async updateWalletSetting(params) {
    return await ApiService.patch(`api-hot-wallet/setting`, params)
  }

  public static async getDepositWalletList(params: any) {
    return await ApiService.get(`api-hot-wallet/deposit`, { params })
  }

  public static async getWithDrawList(params) {
    return await ApiService.get(`api-hot-wallet/withdraw`, { params })
  }

  public static async getMotherWalletList(params) {
    return await ApiService.get(`api-hot-wallet/wallet`, { params })
  }

  public static async getIncident(params) {
    return await ApiService.get(`api-hot-wallet/incident`, { params })
  }

  public static async updateIncident(params) {
    return await ApiService.post(`api-hot-wallet/incident`, {}, { params })
  }

  public static async getListCoin() {
    return await ApiService.get(`api-hot-wallet/erc20-token`)
  }

  public static async getBlacklistAddress(params) {
    return await ApiService.get(`api-hot-wallet/blacklist-address`, { params })
  }

  public static async getBlacklistUser(params) {
    return await ApiService.get(`api-hot-wallet/blacklist-user`, { params })
  }

  public static async updateBlacklistAddress(params) {
    return await ApiService.patch(`api-hot-wallet/blacklist-address`, params)
  }

  public static async updateIsIgnore(params) {
    return await ApiService.patch(
      `api-hot-wallet/blacklist-address/ignore`,
      params,
    )
  }

  public static async addBlacklistAddress(params) {
    return await ApiService.post(`api-hot-wallet/blacklist-address`, params)
  }

  public static async updateBlacklistUser(params) {
    return await ApiService.patch(`api-hot-wallet/blacklist-user`, params)
  }

  public static async addBlacklistUser(params) {
    return await ApiService.post(`api-hot-wallet/blacklist-user`, params)
  }

  public static async updateIsIgnoreUser(params) {
    return await ApiService.patch(
      `api-hot-wallet/blacklist-user/ignore`,
      params,
    )
  }

  public static async deleteBlacklistAddress(id) {
    return await ApiService.post(
      `api-hot-wallet/blacklist-address/${id}/remove`,
      {},
    )
  }

  public static async deleteBlacklistUser(id) {
    return await ApiService.post(
      `api-hot-wallet/blacklist-user/${id}/remove`,
      {},
    )
  }

  public static async getChainCode() {
    return await ApiService.get(`api-hot-wallet/chain-network`, {})
  }

  public static async queryBlacklistUser(params) {
    return await ApiService.get(`api-hot-wallet/blacklist-user/search-email`, {
      params,
    })
  }

  public static async exportDepositTransactions(params: any) {
    return await ApiService.post(
      `api-hot-wallet/deposit/export`,
      {},
      { params },
    )
  }

  public static async exportWithdrawTransactions(params: any) {
    return await ApiService.post(
      `api-hot-wallet/withdraw/export`,
      {},
      { params },
    )
  }

  public static async retryDepositTransaction(id: number) {
    return await ApiService.post(
      `api-hot-wallet/deposit/${id}/retry-transaction`,
      {},
    )
  }

  public static async createManualDepositTransaction(params: any) {
    return await ApiService.post(
      `api-hot-wallet/deposit/manual-transaction`,
      params,
    )
  }

  public static async createBceManualDepositTransaction(params: any) {
    return await ApiService.post(
      `api-hot-wallet/deposit/bce-manual-transaction`,
      params,
    )
  }

  public static async retryWithdrawTransaction(id: number, params: any) {
    return await ApiService.post(`api-hot-wallet/withdraw/${id}/retry`, params)
  }

  public static async stopWithdrawTransaction(id: number) {
    return await ApiService.post(`api-hot-wallet/withdraw/${id}/stop`, {})
  }

  public static async getDetailWithdrawTransaction(id: number) {
    return await ApiService.get(`api-hot-wallet/withdraw/${id}`)
  }

  public static async getDetailDepositTransaction(id: number) {
    return await ApiService.get(`api-hot-wallet/deposit/${id}`)
  }

  public static async getTrezorWallet(params) {
    return await ApiService.get('api-hot-wallet/trezor-wallet', { params })
  }

  public static async getCollectorAddress() {
    return await ApiService.get('api-hot-wallet/trezor-collector-address')
  }

  public static async createTrezorTransaction(params) {
    return await ApiService.post('api-hot-wallet/trezor-transaction', params)
  }
}
