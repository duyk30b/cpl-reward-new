import { Module } from '@nestjs/common'
import { ApiNotificationService } from './api-notification.service'
import { ApiNotificationController } from './api-notification.controller'
import { NotificationModule } from '@lib/grpc-client/notification'
import { AbilityModule } from '../ability/ability.module'
import { UploadFileModule } from '@lib/upload-file'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [NotificationModule, AbilityModule, UploadFileModule, ConfigModule],
  controllers: [ApiNotificationController],
  providers: [ApiNotificationService],
})
export class ApiNotificationModule {}
