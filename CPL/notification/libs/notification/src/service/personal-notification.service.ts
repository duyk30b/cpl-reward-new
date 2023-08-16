import { DEFAULT_LANG } from '@libs/common'
import {
  ICountUnreadFilter,
  INotificationOfUserFilter,
  INotificationOfUserService,
} from '@libs/notification-aggregate/notification-aggregate.variable'
import { slugify } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { FindConditions, Repository } from 'typeorm'
import { PersonalNotification } from '../entity/personal-notification.entity'
import { ICreatePersonalNotification } from '../notification.interface'
import { ENotificationType } from '../notification.variable'

@Injectable()
export class PersonalNotificationService implements INotificationOfUserService {
  constructor(
    @InjectRepository(PersonalNotification)
    private personalNotificationRepository: Repository<PersonalNotification>,
  ) {}

  async findById(id: string) {
    return await this.personalNotificationRepository.findOne(id)
  }

  async create(personalNotification: ICreatePersonalNotification) {
    const notification = plainToInstance(
      PersonalNotification,
      personalNotification,
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    notification.slug = slugify(notification.title[DEFAULT_LANG])
    return await this.personalNotificationRepository.save(notification)
  }

  async buildListNotificationOfUserQuery(
    userId: string,
    filter: INotificationOfUserFilter,
  ) {
    const { notificationCategoryId, fromTime, toTime } = filter
    const query = this.personalNotificationRepository.createQueryBuilder('pn')

    query.select([
      `CONCAT('${ENotificationType.PERSONAL}', '-', pn.id) as id`,
      'NULL as image',
      'pn.slug as slug',
      'pn.title as title',
      'pn.is_read as is_read',
      'pn.created_at as publish_at',
    ])

    query.andWhere('user_id = :userId', { userId })

    if (notificationCategoryId) {
      query.andWhere('notification_category_id = :notificationCategoryId', {
        notificationCategoryId,
      })
    }

    if (fromTime) {
      query.andWhere('created_at > :fromTime', { fromTime })
    }

    if (toTime) {
      query.andWhere('created_at < :toTime', { toTime })
    }

    return query
  }

  checkNotificationCanDisplayForUser(
    notification: PersonalNotification,
    userId: string,
  ) {
    return notification.userId == userId
  }

  async readNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    await this.personalNotificationRepository.update(
      { id: notificationId, userId },
      { isRead: true },
    )
  }

  async countUnread(userId: string, filter: ICountUnreadFilter) {
    const { notificationCategoryId } = filter
    const conditions: FindConditions<PersonalNotification> = {
      userId,
      isRead: false,
    }

    if (notificationCategoryId) {
      conditions.notificationCategoryId = notificationCategoryId
    }

    return await this.personalNotificationRepository.count(conditions)
  }

  async readAllNotifications(userId: string) {
    await this.personalNotificationRepository.update(
      { userId },
      { isRead: true },
    )
  }
}
