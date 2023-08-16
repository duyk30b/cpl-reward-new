import { NotificationService } from '@lib/grpc-client/notification'
import { UploadFileService } from '@lib/upload-file'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiGroupNotificationDto,
  GroupNotificationFilterDto,
} from './api-notification.dto'

@Injectable()
export class ApiNotificationService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly uploadFileService: UploadFileService,
    private readonly configService: ConfigService,
  ) {}

  async getList(filter: GroupNotificationFilterDto) {
    return await this.notificationService.getListGroupNotification(filter)
  }

  async findById(id: string) {
    return await this.notificationService.findGroupNotificationById(id)
  }

  async create(createDto: ApiGroupNotificationDto) {
    return await this.notificationService.createGroupNotification(createDto)
  }

  async update(id: string, updateDto: ApiGroupNotificationDto) {
    return await this.notificationService.updateGroupNotification({
      id,
      ...updateDto,
    })
  }

  async getSupportedLangs() {
    return await this.notificationService.getSupportedLangs()
  }

  async uploadImage(file: Express.Multer.File) {
    const bucket = this.configService.get('upload_file.s3_notification_bucket')
    const result = await this.uploadFileService.uploadToBucket(
      file,
      null,
      bucket,
    )
    return { data: result.url }
  }
}
