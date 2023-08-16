import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemPushNotificationSetting } from './system-push-notification-setting.entity'
import { SystemPushNotificationSettingService } from './system-push-notification-setting.service'

@Module({
  imports: [TypeOrmModule.forFeature([SystemPushNotificationSetting])],
  providers: [SystemPushNotificationSettingService],
  exports: [SystemPushNotificationSettingService],
})
export class SystemPushNotificationSettingModule {}
