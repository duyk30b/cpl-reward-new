import { DEFAULT_LANG, SUPPORTED_LANGS } from '@libs/common'
import {
  ICountUnreadFilter,
  INotificationOfUserFilter,
  INotificationOfUserService,
} from '@libs/notification-aggregate/notification-aggregate.variable'
import { RedisLockService } from '@libs/redis'
import {
  formatPaginate,
  escapeLikeChars,
  BusinessException,
  CommonError,
  GroupNotificationError,
  currentTimestamp,
  SortType,
  slugify,
  getBufferFromUrl,
} from '@libs/util'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  PaginationTypeEnum,
  paginate,
} from 'nestjs-typeorm-paginate'
import { Brackets, LessThanOrEqual, Repository } from 'typeorm'
import { GroupNotification } from '../entity/group-notification.entity'
import { UserReadGlobalNotification } from '../entity/user-read-global-notification.entity'
import {
  ICreateGroupNotificationDto,
  IGroupNotificationFilter,
  IUpdateGroupNotificationDto,
} from '../notification.interface'
import { ENotificationType } from '../notification.variable'
import * as sharp from 'sharp'
import { UploadFileService } from '@libs/upload-file'

@Injectable()
export class GroupNotificationService implements INotificationOfUserService {
  private readonly logger = new Logger(GroupNotificationService.name)
  constructor(
    @InjectRepository(GroupNotification)
    private groupNotificationRepository: Repository<GroupNotification>,
    @InjectRepository(UserReadGlobalNotification)
    private userReadGlobalNotificationRepository: Repository<UserReadGlobalNotification>,
    private readonly redisLockService: RedisLockService,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async findById(id: string) {
    return await this.groupNotificationRepository.findOne(id)
  }

  async buildListNotificationOfUserQuery(
    userId: string,
    filter: INotificationOfUserFilter,
  ) {
    const { notificationCategoryId, fromTime, toTime } = filter
    const query = this.buildBaseQueryWithUser(userId)

    query.select([
      `CONCAT('${ENotificationType.GLOBAL}', '-', gn.id) as id`,
      'IFNULL(gn.thumbnail, gn.image) as image',
      'gn.slug as slug',
      'gn.title as title',
      `IF (r.id IS NOT NULL, 1, 0) as is_read`,
      'gn.publish_at as publish_at',
    ])

    query
      .andWhere('is_active = 1')
      .andWhere('publish_at <= :now', { now: new Date().getTime() })

    if (notificationCategoryId) {
      query.andWhere('notification_category_id = :notificationCategoryId', {
        notificationCategoryId,
      })
    }

    if (fromTime) {
      query.andWhere('publish_at > :fromTime', { fromTime })
    }

    if (toTime) {
      query.andWhere('publish_at < :toTime', { toTime })
    }

    return query
  }

  checkNotificationCanDisplayForUser(
    notification: GroupNotification,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: string,
  ) {
    // Chỉ cần có link thì sẽ xem được thông báo, không cần chờ đến thời gian publish
    // https://www.wrike.com/workspace.htm?acc=4991776#/task-view?id=1030419947&pid=1029611962&cid=840059583
    return notification.isActive
  }

  async countUnread(userId: string, filter: ICountUnreadFilter) {
    const { notificationCategoryId } = filter
    const query = this.buildBaseQueryWithUser(userId)

    query
      .andWhere('is_active = 1')
      .andWhere('publish_at <= :now', { now: new Date().getTime() })
      .andWhere('r.id IS NULL')

    if (notificationCategoryId) {
      query.andWhere('notification_category_id = :notificationCategoryId', {
        notificationCategoryId,
      })
    }

    return await query.getCount()
  }

  async readNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    const lock = await this.redisLockService.acquire(
      [`group_notification:read:${userId}-${notificationId}`],
      2000,
      {
        retryCount: 20,
        retryDelay: 500,
        retryJitter: 200,
      },
    )

    try {
      const read = new UserReadGlobalNotification()
      read.userId = userId
      read.groupNotificationId = notificationId

      await this.userReadGlobalNotificationRepository
        .createQueryBuilder()
        .insert()
        .into(UserReadGlobalNotification)
        .values(read)
        .orIgnore()
        .execute()
    } finally {
      await lock.release()
    }
  }

  async getUnreadNotificationIds(userId: string) {
    const query = this.buildBaseQueryWithUser(userId)

    query.select(['gn.id as id'])

    query
      .andWhere('is_active = 1')
      .andWhere('publish_at <= :now', { now: new Date().getTime() })
      .andWhere('r.id IS NULL')

    const result = await query.getRawMany()
    return result.map((e) => e.id)
  }

  async readAllNotifications(userId: string) {
    const unreadNotificationIds = await this.getUnreadNotificationIds(userId)

    const reads = unreadNotificationIds.map((notificationId) => {
      const read = new UserReadGlobalNotification()
      read.userId = userId
      read.groupNotificationId = notificationId

      return read
    })

    await this.userReadGlobalNotificationRepository
      .createQueryBuilder()
      .insert()
      .into(UserReadGlobalNotification)
      .values(reads)
      .orIgnore()
      .execute()
  }

  private buildBaseQueryWithUser(userId: string) {
    return this.groupNotificationRepository
      .createQueryBuilder('gn')
      .where('gn.is_global = 1')
      .leftJoin(
        'user_read_global_notification',
        'r',
        'gn.id = r.group_notification_id AND r.user_id = :userId',
        { userId },
      )
  }

  async getListForManagement(filter: IGroupNotificationFilter) {
    const query = this.buildListForManagementQuery(filter)

    const options: IPaginationOptions = {
      page: filter.page || 1,
      limit: filter.limit || 25,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const result = await formatPaginate(paginate(query, options))
    return result
  }

  private buildListForManagementQuery(filter: IGroupNotificationFilter) {
    const {
      searchField,
      searchText,
      notificationCategoryId,
      isActive,
      sort,
      sortType,
    } = filter

    const SORT_FIELD_MAP = {
      is_active: 'is_active',
      created_at: 'created_at',
      publish_at: 'publish_at',
    }

    const SEARCH_FIELD_MAP = {}

    SUPPORTED_LANGS.forEach((lang) => {
      SORT_FIELD_MAP[`title_${lang}`] = `JSON_EXTRACT(title, '$.${lang}')`
      SORT_FIELD_MAP[`content_${lang}`] = `JSON_EXTRACT(content, '$.${lang}')`
      SEARCH_FIELD_MAP[`title_${lang}`] = `JSON_EXTRACT(title, '$.${lang}')`
      SEARCH_FIELD_MAP[`content_${lang}`] = `JSON_EXTRACT(content, '$.${lang}')`
    })

    const query = this.groupNotificationRepository.createQueryBuilder('gn')

    if (searchText) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchField && SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (isActive != null) {
      query.andWhere('is_active = :isActive', { isActive })
    }

    if (notificationCategoryId) {
      query.andWhere('notification_category_id = :notificationCategoryId', {
        notificationCategoryId,
      })
    }

    if (sort && SORT_FIELD_MAP[sort]) {
      query.addOrderBy(SORT_FIELD_MAP[sort], sortType || SortType.ASC)
    } else {
      query.addOrderBy('publish_at', SortType.DESC)
    }
    query.addOrderBy('id', SortType.ASC)

    return query
  }

  async create(createDto: ICreateGroupNotificationDto) {
    const record = new GroupNotification()
    record.image = createDto.image
    record.thumbnail = await this.createThumbnail(
      record.image,
      `group-notification-thumbnail-${currentTimestamp()}-${slugify(
        createDto.title[DEFAULT_LANG],
        30,
      )}`,
    )
    record.title = createDto.title
    record.content = createDto.content
    record.slug = slugify(record.title[DEFAULT_LANG])
    record.isActive = createDto.isActive
    record.notificationCategoryId = createDto.notificationCategoryId
    record.publishAt = createDto.publishAt || new Date().getTime()
    record.needSendMail = createDto.needSendMail
    record.needSendPush = createDto.needSendPush
    record.userGroups = createDto.userGroups || []
    record.isGlobal = !record.userGroups.length
    return await this.groupNotificationRepository.save(record)
  }

  async update(updateDto: IUpdateGroupNotificationDto) {
    const record = await this.findById(updateDto.id)
    if (!record) {
      throw new BusinessException(CommonError.NOT_FOUND)
    }

    if (record.isPublished) {
      const fieldsCanNotChange = [
        // 'needSendMail',
        'needSendPush',
        // 'userGroups',
        'publishAt',
      ]
      const valid = fieldsCanNotChange.every(
        (field) => record[field] == updateDto[field],
      )
      if (!valid) {
        throw new BusinessException(
          GroupNotificationError.CAN_NOT_CHANGE_AFTER_PUBLISHED,
        )
      }
    }

    if (record.image != updateDto.image) {
      record.thumbnail = await this.createThumbnail(
        updateDto.image,
        `group-notification-thumbnail-${currentTimestamp()}-${slugify(
          updateDto.title[DEFAULT_LANG],
          30,
        )}`,
      )
    }

    record.image = updateDto.image
    record.title = updateDto.title
    record.content = updateDto.content
    record.isActive = updateDto.isActive
    record.notificationCategoryId = updateDto.notificationCategoryId
    record.publishAt = updateDto.publishAt || new Date().getTime()
    record.needSendMail = updateDto.needSendMail
    record.needSendPush = updateDto.needSendPush
    record.userGroups = updateDto.userGroups || []
    record.isGlobal = !record.userGroups.length
    return await this.groupNotificationRepository.save(record)
  }

  async getReadyToPublishNotifications() {
    return await this.groupNotificationRepository.find({
      isPublished: false,
      isActive: true,
      publishAt: LessThanOrEqual(currentTimestamp()),
    })
  }

  async publish(id: string) {
    await this.groupNotificationRepository.update(id, { isPublished: true })
  }

  async markMailSent(id: string) {
    await this.groupNotificationRepository.update(id, {
      isMailSent: true,
      mailSentAt: currentTimestamp(),
    })
  }

  async markPushSent(id: string) {
    await this.groupNotificationRepository.update(id, {
      isPushSent: true,
      pushSentAt: currentTimestamp(),
    })
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
