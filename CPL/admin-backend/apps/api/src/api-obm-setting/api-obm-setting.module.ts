import { ObmSettingModule } from '@lib/grpc-client/obm-setting'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiObmSettingController } from './api-obm-setting.controller'
import { ApiObmSettingService } from './api-obm-setting.service'

@Module({
  imports: [ObmSettingModule, AbilityModule],
  controllers: [ApiObmSettingController],
  providers: [ApiObmSettingService],
})
export class ApiObmSettingModule {}
