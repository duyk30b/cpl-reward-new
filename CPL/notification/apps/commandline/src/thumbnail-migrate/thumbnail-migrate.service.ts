import { DEFAULT_LANG } from '@libs/common'
import { GroupNotification } from '@libs/notification'
import { currentTimestamp, getBufferFromUrl, slugify } from '@libs/util'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Command, CommandRunner } from 'nest-commander'
import * as sharp from 'sharp'
import { UploadFileService } from '@libs/upload-file'
import { Repository } from 'typeorm'

@Command({ name: 'thumbnail:migrate' })
export class ThumbnailMigrateService extends CommandRunner {
  private readonly logger = new Logger(ThumbnailMigrateService.name)
  constructor(
    @InjectRepository(GroupNotification)
    private readonly groupNotificationRepository: Repository<GroupNotification>,
    private readonly uploadFileService: UploadFileService,
  ) {
    super()
  }

  async run(): Promise<void> {
    const notifications = await this.groupNotificationRepository.find()
    const promises = notifications.map((notification) =>
      this.processThumbnail(notification),
    )
    await Promise.all(promises)
    this.logger.log('Done')
  }

  async processThumbnail(notification: GroupNotification) {
    if (notification.thumbnail) return
    const thumbnail = await this.createThumbnail(
      notification.image,
      `group-notification-thumbnail-${currentTimestamp()}-${slugify(
        notification.title[DEFAULT_LANG],
        30,
      )}`,
    )
    await this.groupNotificationRepository.update(
      { id: notification.id },
      {
        thumbnail,
      },
    )
    this.logger.log(`Done notification: ${notification.id}`)
  }

  async createThumbnail(sourceImageUrl: string, outputName: string) {
    try {
      const buffer = await getBufferFromUrl(sourceImageUrl)
      const resizedBuffer = await sharp(buffer)
        .resize(256, 256, {
          withoutEnlargement: true,
          fit: 'outside',
        })
        .toBuffer()
      const resizedUploadResult = await this.uploadFileService.uploadBuffer(
        resizedBuffer,
        outputName,
      )
      return resizedUploadResult?.url || null
    } catch (e) {
      this.logger.error(e)
      return null
    }
  }
}
