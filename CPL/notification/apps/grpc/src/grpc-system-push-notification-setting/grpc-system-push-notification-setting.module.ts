import { Module } from '@nestjs/common'
import { BullQueueModule } from '@libs/redis'
import { SystemPushNotificationSettingModule } from '@libs/system-push-notification-setting'
import { GrpcSystemPushNotificationSettingController } from './grpc-system-push-notification-setting.controller'
import { GrpcSystemPushNotificationSettingService } from './grpc-system-push-notification-setting.service'

@Module({
  imports: [
    SystemPushNotificationSettingModule,
    BullQueueModule.registerProducer(),
  ],
  controllers: [GrpcSystemPushNotificationSettingController],
  providers: [GrpcSystemPushNotificationSettingService],
})
export class GrpcSystemPushNotificationSettingModule {}
