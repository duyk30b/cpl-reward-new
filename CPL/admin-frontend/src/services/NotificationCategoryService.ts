import ApiService from '@/core/services/ApiService'

export class NotificationCategoryService {
  public static async getList() {
    return await ApiService.get(`/notification-category`)
  }
}
