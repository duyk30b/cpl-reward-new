import { GroupNotification } from '@libs/notification'
import { UploadFileModule } from '@libs/upload-file'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThumbnailMigrateService } from './thumbnail-migrate.service'

@Module({
  imports: [TypeOrmModule.forFeature([GroupNotification]), UploadFileModule],
  providers: [ThumbnailMigrateService],
})
export class ThumbnailMigrateModule {}
