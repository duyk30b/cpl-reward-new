import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { GrpcNotificationCategoryService } from './grpc-notification-category.service'

@Controller('NotificationCategory')
export class GrpcNotificationCategoryController {
  constructor(
    private readonly grpcNotificationCategoryService: GrpcNotificationCategoryService,
  ) {}

  @GrpcMethod('NotificationCategoryService')
  async getList() {
    return await this.grpcNotificationCategoryService.getList()
  }
}
