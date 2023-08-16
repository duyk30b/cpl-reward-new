import { Module } from '@nestjs/common'
import { UploadFileService } from './services/upload-file.service'
import { S3Client } from '@aws-sdk/client-s3'
import { FileService } from './services/file.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadedFile } from './entities/uploaded-file.entity'
import { ConfigModule } from '@nestjs/config'
import upload_file from 'config/upload-file'
import { MultipartUploaderService } from './services/multipart-uploader.service'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [upload_file] }),
    TypeOrmModule.forFeature([UploadedFile]),
  ],
  providers: [
    UploadFileService,
    S3Client,
    FileService,
    MultipartUploaderService,
  ],
  exports: [UploadFileService, FileService, MultipartUploaderService],
})
export class UploadFileModule {}
