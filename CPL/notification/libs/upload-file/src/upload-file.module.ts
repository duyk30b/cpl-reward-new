import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import uploadFileConfig from './upload-file.config'
import { UploadFileService } from './upload-file.service'

@Module({
  imports: [ConfigModule.forFeature(uploadFileConfig)],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
