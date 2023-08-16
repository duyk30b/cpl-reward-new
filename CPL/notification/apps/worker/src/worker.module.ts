import { UserModule } from '@libs/grpc-client'
import { MailModule } from '@libs/mail'
import { BullQueueModule } from '@libs/redis'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import globalConfig from 'config/global.config'
import { MailConsumer } from './consumers/mail-command.consumer'
import { PushConsumer } from './consumers/push-command.consumer'
import { WorkerPushService } from './services/worker-push.service'
import { I18nModule, I18nJsonParser } from 'nestjs-i18n'
import { join } from 'path'
import { FirebaseAdminModule } from '@libs/firebase-admin'
import { DeviceTokenModule } from '@libs/device-token'
import { MysqlModule } from '@libs/mysql'
import { UserSettingModule } from '@libs/user-setting'
import { DEFAULT_LANG } from '@libs/common'
import { HealthModule } from './health/health.module'
import { MongoModule } from '@libs/mongo'
import { NotiLogModule } from '@libs/noti-log'
import { WorkerGroupNotificationService } from './services/worker-group-notification.service'
import { GroupNotificationConsumer } from './consumers/group-notification.consumer'
import { WorkerMailService } from './services/worker-mail.service'
import { WorkerUserFilterService } from './services/worker-user-filter.service'
import { UserFilterConsumer } from './consumers/user-filter.consumer'

@Module({
  imports: [
    FirebaseAdminModule,
    ConfigModule.forRoot({
      load: [globalConfig],
      isGlobal: true,
    }),
    UserSettingModule,
    NotiLogModule,
    MysqlModule,
    MongoModule,
    BullQueueModule.forRoot(),
    BullQueueModule.registerConsumer(),
    BullQueueModule.registerProducer(),
    UserModule,
    MailModule,
    DeviceTokenModule,
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANG,
      parser: I18nJsonParser,
      parserOptions: {
        path: join(__dirname, '/i18n/'),
      },
    }),
    HealthModule,
  ],
  providers: [
    MailConsumer,
    PushConsumer,
    GroupNotificationConsumer,
    UserFilterConsumer,
    WorkerMailService,
    WorkerPushService,
    WorkerGroupNotificationService,
    WorkerUserFilterService,
  ],
})
export class WorkerModule {}
