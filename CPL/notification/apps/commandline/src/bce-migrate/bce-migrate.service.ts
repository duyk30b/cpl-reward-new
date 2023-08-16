import { BceSettingNotification } from '@libs/bce-mysql/entities/bce-setting-notification.entity'
import { BceUserNotification } from '@libs/bce-mysql/entities/bce-user-notification.entity'
import {
  ENotificationCategory,
  GroupNotification,
  UserReadGlobalNotification,
} from '@libs/notification'
import { slugify } from '@libs/util'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Command, CommandRunner } from 'nest-commander'
import { Repository } from 'typeorm'

@Command({ name: 'bce:migrate' })
export class BceMigrateService extends CommandRunner {
  private readonly logger = new Logger(BceMigrateService.name)

  constructor(
    @InjectRepository(BceSettingNotification, 'bce')
    private readonly bceSettingNotificationRepository: Repository<BceSettingNotification>,
    @InjectRepository(BceUserNotification, 'bce')
    private readonly bceUserNotificationRepository: Repository<BceUserNotification>,
    @InjectRepository(GroupNotification)
    private readonly groupNotificationRepository: Repository<GroupNotification>,
    @InjectRepository(UserReadGlobalNotification)
    private readonly userReadGlobalNotificationRepository: Repository<UserReadGlobalNotification>,
  ) {
    super()
  }

  async run(passedParam: string[]): Promise<void> {
    await this.groupNotificationRepository.clear()
    await this.userReadGlobalNotificationRepository.clear()
    await this.migrateGroupNotification()
    await this.migrateUserReadGlobalNotification()
    this.logger.log('Done')
  }

  async migrateGroupNotification() {
    const bceNotifications = await this.bceSettingNotificationRepository.find()
    for (const bceNotification of bceNotifications) {
      const notification = new GroupNotification()
      notification.id = bceNotification.id
      notification.title = {
        en: bceNotification.titleEn,
        ja: bceNotification.titleJa,
      }
      notification.content = {
        en: bceNotification.contentEn,
        ja: bceNotification.contentJa,
      }
      notification.slug = slugify(notification.title.en)
      notification.notificationCategoryId = ENotificationCategory.ANNOUNCEMENT
      notification.image = bceNotification.thumbnail
      notification.isActive = bceNotification.isActive
      notification.publishAt =
        bceNotification.publicAt && new Date(bceNotification.publicAt).getTime()
          ? new Date(bceNotification.publicAt).getTime()
          : new Date(bceNotification.createdAt).getTime()
      notification.isPublished = notification.publishAt < new Date().getTime()
      notification.createdAt = new Date(bceNotification.createdAt).getTime()
      await this.groupNotificationRepository.save(notification)
      this.logger.log('Migrated notification id: ' + bceNotification.id)
    }
  }

  async migrateUserReadGlobalNotification() {
    const count = await this.bceUserNotificationRepository.count()
    const PER_PAGE = 2500
    const numberOfPage = Math.round(count / PER_PAGE) + 1
    const promises = []
    for (let i = 0; i < numberOfPage; i++) {
      promises.push(this.migrateUserReadGlobalNotificationChunk(i, PER_PAGE))
    }
    await Promise.all(promises)
  }

  async migrateUserReadGlobalNotificationChunk(page: number, perPage: number) {
    const items = await this.bceUserNotificationRepository
      .createQueryBuilder()
      .orderBy('id', 'ASC')
      .limit(perPage)
      .offset(page * perPage)
      .getMany()
    for (const item of items) {
      const read = new UserReadGlobalNotification()
      read.userId = item.userId
      read.groupNotificationId = item.notificationId

      try {
        await this.userReadGlobalNotificationRepository.save(read)
      } catch (e) {
        this.logger.error(e, e.stack)
      }
    }
    this.logger.log('Migrated user read notification chunk: ' + page)
  }
}
