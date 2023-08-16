import { Module } from '@nestjs/common'
import { ArtemisService } from './artemis.service'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import cynopsis from '../../../config/cynopsis'
import { AuthSettingModule } from '@lib/grpc-client/auth-setting'

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ load: [cynopsis] }),
    AuthSettingModule,
  ],
  providers: [ArtemisService],
  exports: [ArtemisService],
})
export class ArtemisModule {}
