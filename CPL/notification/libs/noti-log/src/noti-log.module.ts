import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import notiLogConfig from './noti-log.config'
import { MailLogService } from './services/mail-log.service'
import { PushLogService } from './services/push-log.service'

@Module({
  imports: [ConfigModule.forFeature(notiLogConfig)],
  providers: [PushLogService, MailLogService],
  exports: [PushLogService, MailLogService],
})
export class NotiLogModule {}
