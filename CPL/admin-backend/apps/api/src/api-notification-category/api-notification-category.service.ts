import { NotificationCategoryService } from '@lib/grpc-client/notification-category'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ApiNotificationCategoryService {
  constructor(
    private readonly notificationCategoryService: NotificationCategoryService,
  ) {}

  async getList() {
    return await this.notificationCategoryService.getList()
  }
}
