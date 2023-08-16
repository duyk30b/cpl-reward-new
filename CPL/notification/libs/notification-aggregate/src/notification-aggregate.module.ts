import { MailScheduleModule } from 'libs/mail-schedule/src'
import { NotificationModule } from '@libs/notification'
import { PushScheduleModule } from '@libs/push-schedule'
import { BullQueueModule } from '@libs/redis'
import { SystemPushNotificationSettingModule } from '@libs/system-push-notification-setting'
import { UserSettingModule } from '@libs/user-setting'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { NotificationAggregateService } from './notification-aggregate.service'

@Module({
  imports: [
    UserSettingModule,
    NotificationModule,
    BullQueueModule.registerProducer(),
    SystemPushNotificationSettingModule,
    ConfigModule,
    MailScheduleModule,
    PushScheduleModule,
  ],
  providers: [NotificationAggregateService],
  exports: [NotificationAggregateService],
})
export class NotificationAggregateModule {}
