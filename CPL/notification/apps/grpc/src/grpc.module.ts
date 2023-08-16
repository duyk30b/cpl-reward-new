import { MysqlModule } from '@libs/mysql'
import { BullQueueModule } from '@libs/redis'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import globalConfig from 'config/global.config'
import { HealthModule } from './health/health.module'
import { GrpcNotificationModule } from './grpc-notification/grpc-notification.module'
import { GrpcSystemPushNotificationSettingModule } from './grpc-system-push-notification-setting/grpc-system-push-notification-setting.module'
import { GrpcNotificationCategoryModule } from './grpc-notification-category/grpc-notification-category.module'

@Module({
  imports: [
    MysqlModule,
    HealthModule,
    ConfigModule.forRoot({
      load: [globalConfig],
      isGlobal: true,
    }),
    BullQueueModule.forRoot(),
    GrpcNotificationModule,
    GrpcSystemPushNotificationSettingModule,
    GrpcNotificationCategoryModule,
  ],
})
export class GrpcModule {}
