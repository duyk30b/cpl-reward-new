import { Module } from '@nestjs/common'
import { UserConsumerService } from './user-consumer.service'
import { UserConsumerController } from './user-consumer.controller'
import { BullQueueModule } from '@libs/redis'
import { NotificationModule } from '@libs/notification'
import { ConfigModule } from '@nestjs/config'
import { UserInfoModule } from '@libs/grpc-client/user-info'
import { DeviceTokenModule } from '@libs/device-token'
import { NotificationAggregateModule } from '@libs/notification-aggregate'
import { UserSettingModule } from '@libs/user-setting'
import { Mt5Module } from '@libs/grpc-client/mt5'

@Module({
  imports: [
    ConfigModule,
    UserInfoModule,
    DeviceTokenModule,
    NotificationAggregateModule,
    BullQueueModule.registerProducer(),
    NotificationModule,
    UserSettingModule,
    Mt5Module,
  ],
  controllers: [UserConsumerController],
  providers: [UserConsumerService],
})
export class UserConsumerModule {}
