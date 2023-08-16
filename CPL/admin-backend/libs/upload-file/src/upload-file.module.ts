import { Module } from '@nestjs/common'
import { UploadFileService } from './upload-file.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration'
import { LogModule } from '@lib/log'

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), LogModule],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
