import { Module } from '@nestjs/common'
import { ApiNotificationService } from './api-notification.service'
import { ApiNotificationController } from './api-notification.controller'
import { NotificationAggregateModule } from '@libs/notification-aggregate'
import { NotificationModule } from '@libs/notification'
import { BullQueueModule, RedisModule } from '@libs/redis'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    NotificationAggregateModule,
    NotificationModule,
    RedisModule,
    ConfigModule,
    BullQueueModule.registerProducer(),
  ],
  controllers: [ApiNotificationController],
  providers: [ApiNotificationService],
})
export class ApiNotificationModule {}
