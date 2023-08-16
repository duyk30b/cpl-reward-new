import ApiService from '@/core/services/ApiService'

export class MT5Service {
  // PAYOUT
  /**
   * getListPayout
   * @returns
   */
  public static async getListPayout(params) {
    return await ApiService.get(`/mt5/payment/payouts`, { params })
  }
  /**
   * getPayoutDetail
   * @param payoutId
   * @returns
   */
  public static async getPayoutDetail(payoutId: string) {
    return await ApiService.get(`/mt5/payment/payout/${payoutId}`)
  }
  /**
   * approvePayout
   * @param params
   * @returns
   */
  public static async approvePayout(data) {
    return await ApiService.post('/mt5/payment/payout/approve', data)
  }
  /**
   * approvePayout
   * @param params
   * @returns
   */
  public static async rejectPayout(data) {
    return await ApiService.post('/mt5/payment/payout/reject', data)
  }
  /**
   * confirmBankTransferPayout
   * @param data
   * @returns
   */
  public static async confirmBankTransferPayout(data) {
    return await ApiService.post(
      '/mt5/payment/payout/confirmBankTransfer',
      data,
    )
  }
  /**
   * rejectBankTransferPayout
   * @param data
   * @returns
   */
  public static async rejectBankTransferPayout(data) {
    return await ApiService.post('/mt5/payment/payout/rejectBankTransfer', data)
  }

  // PAYIN
  /**
   * getListPayin
   * @returns
   */
  public static async getListPayin(params) {
    return await ApiService.get(`/mt5/payment/payins`, { params })
  }
  /**
   * getPayinDetail
   * @param payoutId
   * @returns
   */
  public static async getPayinDetail(payout_id: string) {
    return await ApiService.get(`/mt5/payment/payin/${payout_id}`)
  }
  /**
   * approvePayin
   * @param params
   * @returns
   */
  public static async approvePayin(data) {
    return await ApiService.post('/mt5/payment/payin/approve', data)
  }
  /**
   * approvePayin
   * @param params
   * @returns
   */
  public static async rejectPayin(data) {
    return await ApiService.post('/mt5/payment/payin/reject', data)
  }
}
