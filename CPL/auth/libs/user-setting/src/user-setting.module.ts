import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserSettingService } from './user-setting.service'

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [UserSettingService],
  exports: [UserSettingService],
})
export class UserSettingModule {}
