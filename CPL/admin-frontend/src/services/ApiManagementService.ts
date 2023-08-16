import ApiService from '@/core/services/ApiService'

export class ApiManagementService {
  public static async approveKeyRequest(credentials) {
    return ApiService.post(
      `/api-key-management/approve-key-request`,
      credentials,
    )
  }
  public static async detailKey(id) {
    return await ApiService.get(`/api-key-management/${id}`)
  }
  public static async getKeys(params) {
    return await ApiService.get(`/api-key-management/list`, { params })
  }
  public static async getStatusHistories(apiKeyId) {
    return await ApiService.get(`/api-key-management/histories/${apiKeyId}`)
  }
}
