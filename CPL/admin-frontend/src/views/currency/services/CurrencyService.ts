import ApiService from '@/core/services/ApiService'

export class CurrencyService {
  public static async getListCurrency(params) {
    return await ApiService.get(`/api-auto-add-setting/currency`, { params })
  }

  public static async createNewCurrency(body) {
    return await ApiService.post(`/api-auto-add-setting/currency`, body)
  }

  public static async getSmartContract(params: {
    address: string
    chain_code: string
  }) {
    return await ApiService.get(`/api-auto-add-setting/smart-contract`, {
      params,
    })
  }

  public static async uploadCurrencyIcon(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await ApiService.post(
      `/api-auto-add-setting/currency/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }

  public static async updateCurrency(body) {
    return await ApiService.patch(`/api-auto-add-setting/currency`, body)
  }

  public static async changeStatus(body) {
    return await ApiService.post(`/api-auto-add-setting/currency/status`, body)
  }

  public static async checkValidCurrency(params) {
    return await ApiService.get(`/api-auto-add-setting/valid-currency`, {
      params,
    })
  }
}
