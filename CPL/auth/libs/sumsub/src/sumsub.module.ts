import { UploadFileModule } from '@lib/upload-file'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import sumsubConfig from './sumsub.config'
import { SumsubService } from './sumsub.service'

@Module({
  imports: [
    ConfigModule.forFeature(sumsubConfig),
    HttpModule,
    UploadFileModule,
  ],
  providers: [SumsubService],
  exports: [SumsubService],
})
export class SumsubModule {}
