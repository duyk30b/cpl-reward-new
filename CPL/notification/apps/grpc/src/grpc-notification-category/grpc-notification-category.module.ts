import { Module } from '@nestjs/common'
import { GrpcNotificationCategoryController } from './grpc-notification-category.controller'
import { GrpcNotificationCategoryService } from './grpc-notification-category.service'

@Module({
  controllers: [GrpcNotificationCategoryController],
  providers: [GrpcNotificationCategoryService],
})
export class GrpcNotificationCategoryModule {}
