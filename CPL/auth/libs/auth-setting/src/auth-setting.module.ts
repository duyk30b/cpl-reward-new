import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import kyc from 'config/kyc'
import { AuthSettingService } from './auth-setting.service'

@Module({
  imports: [ConfigModule.forFeature(kyc)],
  providers: [AuthSettingService],
  exports: [AuthSettingService],
})
export class AuthSettingModule {}
