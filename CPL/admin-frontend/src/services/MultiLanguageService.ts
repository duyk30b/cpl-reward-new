import ApiService from '@/core/services/ApiService'

export class MultiLanguageService {
  public static async setTranslate(credentials) {
    return ApiService.post(`/api-language/set-translate`, credentials)
  }
  public static async getTranslates(params) {
    return await ApiService.get(`/api-language/list-translates`, { params })
  }
  public static async getTranslatesByKeys(body: { keys: string[] }) {
    return await ApiService.post(`/api-language/get-by-keys`, body)
  }
  public static async importFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await ApiService.post('/api-language/import-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  public static async previewFile(key: string) {
    return await ApiService.post(
      '/api-language/preview-file',
      { key },
      { responseType: 'arraybuffer' },
    )
  }
  public static async applyAll(key: string) {
    return await ApiService.post('/api-language/apply-all', { key })
  }
  public static async exportAll() {
    return await ApiService.post(
      '/api-language/export-all',
      {},
      { responseType: 'arraybuffer' },
    )
  }
  public static async getLanguages(params) {
    return await ApiService.get(`/api-language/list-language`, {
      params,
    })
  }

  public static async setLanguage(credentials) {
    return ApiService.post(`/api-language/set-language`, credentials)
  }

  public static async getCodeLanguages(params) {
    return ApiService.get(`/api-language/code-languages`, { params })
  }

  public static async getListCodeLanguages() {
    return ApiService.get(`/api-language/list-code-languages`)
  }

  public static async getLanguagesByType(params) {
    const result = await ApiService.get(`/api-language/get-languages-by-type`, {
      params,
    })
    return result.data === undefined || result.data.length === 0
      ? []
      : result.data
  }

  public static async getPairCategoriesKey() {
    return ApiService.get(`/api-language/get-pair-categories-keys`)
  }
}
