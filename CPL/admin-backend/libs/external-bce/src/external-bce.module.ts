import { Module } from '@nestjs/common'
import { ExternalBceService } from './external-bce.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration'
import { HttpModule } from '@nestjs/axios'
import { LogModule } from '@lib/log'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    HttpModule,
    LogModule,
  ],
  providers: [ExternalBceService],
  exports: [ExternalBceService],
})
export class ExternalBceModule {}
