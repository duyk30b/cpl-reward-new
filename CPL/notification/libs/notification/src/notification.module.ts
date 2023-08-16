import { RedisModule } from '@libs/redis'
import { UploadFileModule } from '@libs/upload-file'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupNotification, UserReadGlobalNotification } from './entity'
import { PersonalNotification } from './entity/personal-notification.entity'
import { GroupNotificationService } from './service/group-notification.service'
import { PersonalNotificationService } from './service/personal-notification.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonalNotification,
      GroupNotification,
      UserReadGlobalNotification,
    ]),
    RedisModule,
    UploadFileModule,
  ],
  providers: [PersonalNotificationService, GroupNotificationService],
  exports: [PersonalNotificationService, GroupNotificationService],
})
export class NotificationModule {}
