import { Module } from '@nestjs/common'
import { GrpcNotificationService } from './grpc-notification.service'
import { GrpcNotificationController } from './grpc-notification.controller'
import { NotificationModule } from '@libs/notification'
import { BullQueueModule } from '@libs/redis'
import { NotificationAggregateModule } from '@libs/notification-aggregate'
import { MailScheduleModule } from '@libs/mail-schedule'
import { PushScheduleModule } from '@libs/push-schedule'

@Module({
  imports: [
    NotificationModule,
    NotificationAggregateModule,
    MailScheduleModule,
    PushScheduleModule,
    BullQueueModule.registerProducer(),
  ],
  controllers: [GrpcNotificationController],
  providers: [GrpcNotificationService],
})
export class GrpcNotificationModule {}
