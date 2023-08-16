import { NotificationCategoryModule } from '@lib/grpc-client/notification-category'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiNotificationCategoryController } from './api-notification-category.controller'
import { ApiNotificationCategoryService } from './api-notification-category.service'

@Module({
  imports: [NotificationCategoryModule, AbilityModule],
  controllers: [ApiNotificationCategoryController],
  providers: [ApiNotificationCategoryService],
})
export class ApiNotificationCategoryModule {}
