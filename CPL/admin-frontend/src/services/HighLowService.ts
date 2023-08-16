import ApiService from '@/core/services/ApiService'

export class HighLowService {
  /**
   * getPeriod
   * @returns
   */
  public static async getPeriod() {
    return await ApiService.get('/bo/setting/period')
  }

  /**
   * getHistoriesOrders
   * @param params
   * @returns
   */
  public static async getHistoriesOrders(params) {
    if (params.sort == 'mode') {
      params.sort = 'mode_id'
    }

    if (params.winLose) {
      params.win_lose = params.winLose
    }

    return await ApiService.get(`/bo/user-tradings`, { params })
  }

  /**
   * exportHistoriesOrders
   * @param params
   * @returns
   */
  public static async exportHistoriesOrders(params) {
    if (params.sort == 'mode') {
      params.sort = 'mode_id'
    }

    return await ApiService.get(`/bo/user-tradings/export`, { params })
  }

  /**
   * getTransfers
   * @param params
   * @returns
   */
  public static async getTransfers(params) {
    if (params.sort == 'transferFrom') {
      params.sort = 'balance_type_from'
    }

    if (params.sort == 'transferTo') {
      params.sort = 'balance_type_to'
    }

    if (params.sort == 'createdAt') {
      params.sort = 'created_at'
    }

    if (params.from == 'bitcastle') {
      params.balance_type_from = 'EXCHANGE'
    }

    if (params.from == 'HIGH/LOW') {
      params.balance_type_from = 'BO'
    }

    if (params.to == 'bitcastle') {
      params.to = 'EXCHANGE'
    }

    if (params.to == 'HIGH/LOW') {
      params.to = 'BO'
    }
    return await ApiService.get(`/bo/user-balances/transfers`, { params })
  }

  /**
   * exportTransfers
   * @param params
   * @returns
   */
  public static async exportTransfers(params) {
    if (params.sort == 'transferFrom') {
      params.sort = 'balance_type_from'
    }

    if (params.sort == 'transferTo') {
      params.sort = 'balance_type_to'
    }

    if (params.sort == 'createdAt') {
      params.sort = 'created_at'
    }
    return await ApiService.get(`/bo/user-balances/transfers/export`, {
      params,
    })
  }

  /**
   * getHistoryOrdersExport
   * @returns
   */
  public static async getHistoryOrdersExport() {
    return await ApiService.get('/history-orders/export')
  }

  /**
   * createHistoryOrdersExport
   * @param params
   * @returns
   */
  public static async createHistoryOrdersExport(params) {
    return await ApiService.post('/history-orders/export', params)
  }

  // Statistic

  /**
   * getStatisticSummary
   * @param params
   * @returns
   */
  public static async getStatisticSummary(params) {
    return await ApiService.get(`/bo/statistic/summary`, { params })
  }

  /**
   * exportStatisticSummary
   * @param params
   * @returns
   */
  public static async exportStatisticSummary(params) {
    return await ApiService.get(`/bo/statistic/summary/export`, { params })
  }

  // User Balance

  /**
   * getUsersBalance
   * @returns
   */
  public static async getUsersBalance(params) {
    return await ApiService.get('/bo/user-balances', {
      params: {
        search_field: params.search_field || 'email',
        search_text: params.search_text || '',
      },
    })
  }

  /**
   * exportUsersBalance
   * @returns
   */
  public static async exportUsersBalance(params) {
    const searchField = params.search_field || ''
    const searchText = params.search_text || ''
    const sort = params.sort || ''
    const sortType = params.sort_type || ''
    const lang = params.lang || ''

    return await ApiService.get(
      `/bo/user-balances/export?search_field=${searchField}&search_text=${searchText}&sort=${sort}&sort_type=${sortType}&lang=${lang}`,
    )
  }

  /**
   * exportUsersBalance
   * @returns
   */
  public static async exportPairSetting(params) {
    const searchField = params.search_field || ''
    const searchText = params.search_text || ''
    const sort = params.sort || ''
    const sortType = params.sort_type || ''
    const lang = params.lang || ''

    return await ApiService.get(
      `/bo/setting/pair-settings/export?search_field=${searchField}&search_text=${searchText}&sort=${sort}&sort_type=${sortType}&lang=${lang}`,
    )
  }

  /**
   * getExport
   * @param params
   * @returns
   */
  public static async getExport() {
    return await ApiService.get('/bo/list-export')
  }

  /**
   * getUsersDetail
   * @param params
   * @returns
   */
  public static async getUsersDetail(params) {
    return await ApiService.get(`/bo/statistic/detail`, { params })
  }

  /**
   * exportUsersDetail
   * @param params
   * @returns
   */
  public static async exportUsersDetail(params) {
    return await ApiService.get(`/bo/statistic/detail/export`, { params })
  }

  /**
   * getUsersStatistic
   * @param params
   * @returns
   */
  public static async getUsersStatistic(params) {
    return await ApiService.get(`/bo/statistic/user`, { params })
  }

  /**
   * downloadUsersStatistic
   * @param params
   * @returns
   */
  public static async exportUsersStatistic(params) {
    return await ApiService.get(`/bo/statistic/user/export`, { params })
  }

  // Unlimited user
  /**
   * getUnlimitedUser
   * @param params
   * @returns
   */
  public static async getUnlimitedUser(params) {
    if (params.search_text) {
      params.search_text = params.search_text.trim()
    }

    return await ApiService.get(`/bo/unlimited-user`, { params })
  }

  /**
   * exportUnlimitedUser
   * @param params
   * @returns
   */
  public static async exportUnlimitedUser(params) {
    if (params.search_text) {
      params.search_text = params.search_text.trim()
    }

    return await ApiService.get(`/bo/unlimited-user/export`, { params })
  }

  /**
   * getUserVerified
   * @param params
   * @returns
   */
  public static async getUserVerified(params) {
    return await ApiService.get(`/bo/searchUserVerified`, { params })
  }

  /**
   * registerUser
   * @param params
   * @returns
   */
  public static async registerUser(params) {
    return await ApiService.post(`/bo/unlimited-user`, params)
  }

  /**
   * addUnlimitedUser
   * @param userId
   * @returns
   */
  public static async addUnlimitedUser(userId) {
    return await ApiService.post(`/bo/unlimited-user`, { userId: userId })
  }

  /**
   * deleteUnlimitedUser
   * @param id
   * @returns
   */
  public static async deleteUnlimitedUser(id) {
    return await ApiService.delete(`/bo/unlimited-user/${id}`)
  }

  // User grant payout
  /**
   * getUserGrantPayout
   * @param params
   * @returns
   */
  public static async getUserGrantPayout(params) {
    if (params.search_text) {
      params.search_text = params.search_text.trim()
    }

    return await ApiService.get(`/bo/user-grant-payout`, { params })
  }

  /**
   * addUserGrantPayout
   * @param params
   * @returns
   */
  public static async addUserGrantPayout(data) {
    return await ApiService.post(`/bo/user-grant-payout`, data)
  }

  /**
   * updateUserGrantPayout
   * @param params
   * @returns
   */
  public static async updateUserGrantPayout(data, id) {
    return await ApiService.put(`/bo/user-grant-payout/${id}`, data)
  }

  /**
   * exportGrantPayout
   * @param params
   * @returns
   */
  public static async exportGrantPayout(params) {
    if (params.search_text) {
      params.search_text = params.search_text.trim()
    }

    return await ApiService.get(`/bo/user-grant-payout/export`, { params })
  }

  // Block User
  /**
   * getBlockedUser
   * @param params
   * @returns
   */
  public static async getBlockedUser(params) {
    if (params.search_text) {
      params.search_text = params.search_text.trim()
    }

    return await ApiService.get(`/bo/block-user`, { params })
  }

  /**
   * exportBlockedUser
   * @param params
   * @returns
   */
  public static async exportBlockedUser(params) {
    if (params.search_text) {
      params.search_text = params.search_text.trim()
    }

    return await ApiService.get(`/bo/block-user/export`, { params })
  }

  /**
   * addBlockedUser
   * @param params
   * @returns
   */
  public static async addBlockedUser(params) {
    return await ApiService.post(`/bo/block-user`, params)
  }

  /**
   * deleteBlockedUser
   * @param id
   * @returns
   */
  public static async deleteBlockedUser(id) {
    return await ApiService.delete(`/bo/block-user/${id}`)
  }

  /**
   * generateLeaderBoard
   * @param data
   * @returns
   */
  public static async generateLeaderBoard(data) {
    return await ApiService.put(`/bo/leader-board`, data)
  }

  // Setting Trading
  /**
   * getTradingPair
   * @param params
   * @returns
   */
  public static async getTradingPair(params) {
    return await ApiService.get(`/bo/setting/trading-modes`, { params })
  }

  /**
   * getPairSetting
   * @param params
   * @returns
   */
  public static async getPairSetting(params) {
    return await ApiService.get(`/bo/setting/pair-settings`, { params })
  }

  /**
   * getTradingMode
   * @param id
   * @returns
   */
  public static async getTradingMode(id: string) {
    return await ApiService.get(`/bo/setting/trading-modes/${id}`)
  }

  /**
   * updateTradingMode
   * @param id
   * @returns
   */
  public static async updateTradingMode(id: string, data) {
    return await ApiService.patch(`/bo/setting/trading-modes/${id}`, data)
  }

  /**
   * updateTradingModeStatus
   * @param id
   * @returns
   */
  public static async updateTradingModeStatus(id: string, data) {
    return await ApiService.patch(
      `/bo/setting/trading-modes-status/${id}`,
      data,
    )
  }

  /**
   * exportTradingMode
   * @param params
   * @returns
   */
  public static async exportTradingMode(params) {
    return await ApiService.get(`/bo/setting/trading-modes/export`, { params })
  }

  /**
   * createPair
   * @param params
   * @returns
   */
  public static async createPair(params) {
    return await ApiService.post(`/bo/setting/pair-settings`, params)
  }

  /**
   * updatePair
   * @param params
   * @returns
   */
  public static async updatePair(params) {
    return await ApiService.patch(`/bo/setting/pair-settings`, [params])
  }

  /**
   * getSettings
   * @param params
   * @returns
   */
  public static async getSettings(params) {
    return await ApiService.get(`/bo/setting/bo-settings`, { params })
  }

  /**
   * updateSettings
   * @param params
   * @returns
   */
  public static async updateSettings(params) {
    return await ApiService.patch(`/bo/setting/bo-settings/`, params)
  }

  // Suspension
  /**
   * getSuspensionUsers
   * @param params
   * @returns
   */
  public static async getSuspensionUsers(params) {
    return await ApiService.get(`/bo/suspension/users`, { params })
  }

  /**
   * exportSuspensionCommon
   * @returns
   */
  public static async exportSuspensionCommon(params) {
    const searchField = params.search_field || ''
    const searchText = params.search_text || ''
    const sort = params.sort || ''
    const sortType = params.sort_type || ''
    const lang = params.lang || ''

    return await ApiService.get(
      `/bo/suspension/common/export?search_field=${searchField}&search_text=${searchText}&sort=${sort}&sort_type=${sortType}&lang=${lang}`,
    )
  }

  /**
   * getTradeMode
   * @param params
   * @returns
   */
  public static async getTradeMode(params) {
    const data = await ApiService.get(`/bo/suspension/modes`, { params })

    if (!data.data.data || data.data.data.length == 0) {
      return data
    }

    if (params.sort == 'createdAt' && params.sort_type == 'ASC') {
      const sortedASC = data.data.data.sort(
        (objA, objB) =>
          new Date(objA.createdAt).getTime() -
          new Date(objB.createdAt).getTime(),
      )
      data.data.data = sortedASC
    } else {
      const sortedDESC = data.data.data.sort(
        (objA, objB) =>
          new Date(objB.createdAt).getTime() -
          new Date(objA.createdAt).getTime(),
      )

      data.data.data = sortedDESC
    }

    return data
  }

  /**
   * exportSuspensionTradeMode
   * @returns
   */
  public static async exportSuspensionTradeMode(params) {
    const searchField = params.search_field || ''
    const searchText = params.search_text || ''
    const sort = params.sort || ''
    const sortType = params.sort_type || ''
    const mode = params.mode || ''
    const period = params.period || ''
    const lang = params.lang || ''

    return await ApiService.get(
      `/bo/suspension/trade-mode/export?search_field=${searchField}&search_text=${searchText}&sort=${sort}&sort_type=${sortType}&mode=${mode}&period=${period}&lang=${lang}`,
    )
  }

  /**
   * getMarket
   * @param params
   * @returns
   */
  public static async getMarket(params) {
    return await ApiService.get(`/bo/suspension/pairs`, { params })
  }

  /**
   * exportSuspensionMarket
   * @returns
   */
  public static async exportSuspensionMarket(params) {
    const searchField = params.search_field || ''
    const searchText = params.search_text || ''
    const sort = params.sort || ''
    const sortType = params.sort_type || ''
    const lang = params.lang || ''

    return await ApiService.get(
      `/bo/suspension/market/export?search_field=${searchField}&search_text=${searchText}&sort=${sort}&sort_type=${sortType}&lang=${lang}`,
    )
  }

  // User trading limit
  /**
   * getUserTradingLimit
   * @param params
   * @returns
   */
  public static async getUserTradingLimit(params) {
    const data = await ApiService.get(`/bo/trading-limit-users`, { params })

    if (!data.data.data || data.data.data.length == 0) {
      return data
    }

    if (params.sort == 'createdAt' && params.sort_type == 'ASC') {
      const sortedASC = data.data.data.sort(
        (objA, objB) =>
          new Date(objA.createdAt).getTime() -
          new Date(objB.createdAt).getTime(),
      )
      data.data.data = sortedASC
    }

    if (params.sort == 'createdAt' && params.sort_type == 'DESC') {
      const sortedDESC = data.data.data.sort(
        (objA, objB) =>
          new Date(objB.createdAt).getTime() -
          new Date(objA.createdAt).getTime(),
      )

      data.data.data = sortedDESC
    }

    return data
  }

  /**
   * exportUserTradingLimit
   * @param params
   * @returns
   */
  public static async exportUserTradingLimit(params) {
    const data = await ApiService.get(`/bo/trading-limit-users/export`, {
      params,
    })
    return data
  }

  // Winning rate analysis
  /**
   * getSettingTradingPair
   * @param params
   * @returns
   */
  public static async getSettingTradingPair(params) {
    return await ApiService.get(`/bo/setting/trading-pair`, { params })
  }

  /**
   * updateSettingTradingPair
   * @param id
   * @param data
   * @returns
   */
  public static async updateSettingTradingPair(id, data) {
    return await ApiService.patch(`/bo/setting/trading-pair/${id}`, data)
  }

  /**
   * updateStatusSettingTradingPair
   * @param params
   * @param data
   * @returns
   */
  public static async updateStatusSettingTradingPair(id, data) {
    return await ApiService.patch(`/bo/setting/trading-pair-status/${id}`, data)
  }

  /**
   * getSettingTradingModes
   * @param params
   * @returns
   */
  public static async getSettingTradingModes(params) {
    return await ApiService.get(`/bo/setting/trading-modes`, { params })
  }

  /**
   * getWinningRateSeconds
   * @param params
   * @returns
   */
  public static async getWinningRateSeconds(params) {
    return await ApiService.get(`/bo/winning-rate/seconds`, { params })
  }

  /**
   * getWinningRateMinutes
   * @param params
   * @returns
   */
  public static async getWinningRateMinutes(params) {
    return await ApiService.get(`/bo/winning-rate/minutes`, { params })
  }

  /**
   * getWinningRateHours
   * @param params
   * @returns
   */
  public static async getWinningRateHours(params) {
    return await ApiService.get(`/bo/winning-rate/hours`, { params })
  }

  // Setting Crawler
  /**
   * getSettingCrawler
   * @returns
   */
  public static async getSettingCrawler() {
    return await ApiService.get(`/bo/setting/crawl-settings`)
  }

  /**
   * updateSettingCrawler
   * @param params
   * @returns
   */
  public static async updateSettingCrawler(params) {
    return await ApiService.patch(`/bo/setting/crawl-settings`, params)
  }

  // Statistic crawler
  /**
   * getStatisticCrawler
   * @param params
   * @returns
   */
  public static async getStatisticCrawler(params) {
    params.limit = 60
    return await ApiService.get(`/bo/pair-prices`, { params })
  }

  /**
   * getBTCTransferSetting
   * @returns
   */
  public static async getBTCTransferSetting() {
    return await ApiService.get(`/bo/setting/btc-transfer-setting`)
  }

  /**
   * updateBTCTransferSetting
   * @param params
   * @returns
   */
  public static async updateBTCTransferSetting(params) {
    return await ApiService.patch(`/bo/setting/btc-transfer-setting`, params)
  }

  /**
   * getBTCTransferHistory
   * @param params
   * @returns
   */
  public static async getBTCTransferHistory(params) {
    return await ApiService.get('/bo/setting/btc-transfer-history', { params })
  }

  /**
   * exportSwaps
   * @param params
   * @return
   */
  public static async exportSwaps(params) {
    return await ApiService.get('/bo/swaps/export', { params })
  }

  /**
   * getMajorCoin
   * @param params
   * @returns
   */
  public static async getMajorCoin() {
    return await ApiService.get('/bo/setting/major')
  }

  /**
   * getMajorCoin
   * @param params
   * @returns
   */
  public static async getDetailMajorCoin(coin: string) {
    return await ApiService.get(`/bo/setting/major/${coin}`)
  }

  /**
   * updateMajorCoin
   * @param params
   * @returns
   */
  public static async updateMajorCoin(data) {
    return await ApiService.put(`/bo/setting/major`, data)
  }
}
