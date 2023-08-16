import { NOTIFICATION_CATEGORIES } from '@libs/notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GrpcNotificationCategoryService {
  async getList() {
    return { data: NOTIFICATION_CATEGORIES }
  }
}
