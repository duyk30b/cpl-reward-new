import { Module } from '@nestjs/common'
import { ApiSystemPushSettingService } from './api-system-push-setting.service'
import { ApiSystemPushSettingController } from './api-system-push-setting.controller'
import { SystemPushNotificationSettingModule } from '@lib/grpc-client/system-push-notification-setting'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [SystemPushNotificationSettingModule, AbilityModule],
  controllers: [ApiSystemPushSettingController],
  providers: [ApiSystemPushSettingService],
})
export class ApiSystemPushSettingModule {}
