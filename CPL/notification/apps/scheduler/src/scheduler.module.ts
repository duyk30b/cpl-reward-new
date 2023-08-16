import { MailScheduleModule } from '@libs/mail-schedule'
import { MysqlModule } from '@libs/mysql'
import { NotificationModule } from '@libs/notification'
import { PushScheduleModule } from '@libs/push-schedule'
import { BullQueueModule } from '@libs/redis'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import globalConfig from 'config/global.config'
import { HealthModule } from './health/health.module'
import { SchedulerNotificationService } from './services/scheduler-notification.service'
import { SchedulerPushService } from './services/scheduler-push.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [globalConfig],
      isGlobal: true,
    }),
    BullQueueModule.forRoot(),
    BullQueueModule.registerProducer(),
    HealthModule,
    MysqlModule,
    NotificationModule,
    PushScheduleModule,
    MailScheduleModule,
  ],
  providers: [SchedulerNotificationService, SchedulerPushService],
})
export class SchedulerModule {}
