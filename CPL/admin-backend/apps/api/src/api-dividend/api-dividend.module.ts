import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiDividendController } from './api-dividend.controller'
import { DividendService } from './api-dividend.service'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from '@lib/grpc-client/user'
import configuration from './configuration'

@Module({
  imports: [
    AbilityModule,
    HttpModule,
    ConfigModule.forRoot({ load: [configuration] }),
    UserModule,
  ],
  controllers: [ApiDividendController],
  providers: [DividendService],
})
export class ApiDividendModule {}
