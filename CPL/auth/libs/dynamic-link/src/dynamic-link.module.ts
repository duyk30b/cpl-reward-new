import { Module } from '@nestjs/common'
import { DynamicLinkService } from './dynamic-link.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HttpModule,
  ],
  providers: [DynamicLinkService],
  exports: [DynamicLinkService],
})
export class DynamicLinkModule {}
