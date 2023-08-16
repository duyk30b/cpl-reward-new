import { MultiLanguageFieldDto } from '@libs/common'
import {
  GroupNotification,
  ICreateGroupNotificationDto,
  IUpdateGroupNotificationDto,
  PersonalNotification,
} from '@libs/notification'
import { TransformInt, TransformTextToJson } from '@libs/util'
import { Expose } from 'class-transformer'

export class NotificationForUserDto {
  @Expose()
  id: string

  @Expose()
  image: string

  @Expose()
  slug: string

  @Expose({ name: 'is_read' })
  isRead: number

  @Expose()
  @TransformTextToJson({ toClassOnly: true })
  title: string

  @Expose()
  @TransformTextToJson({ toClassOnly: true })
  content: string

  @Expose({ name: 'publish_at' })
  @TransformInt()
  publishAt: number
}

export interface INotificationOfUserFilter {
  notificationCategoryId?: number
  fromTime?: number
  toTime?: number
  limit?: number
}

export interface ICountUnreadFilter {
  notificationCategoryId?: number
}

export type NotificationOfUser = PersonalNotification | GroupNotification

export interface INotificationOfUserService {
  findById(id: string): Promise<NotificationOfUser>
  checkNotificationCanDisplayForUser(
    notification: NotificationOfUser,
    userId: string,
  ): boolean
  readNotification(userId: string, notificationId: string): Promise<void>
}

export interface IAdminCreateGroupNotificationDto
  extends ICreateGroupNotificationDto {
  mailSchedule?: {
    content: MultiLanguageFieldDto
    userGroups: string[]
  }
  pushSchedule?: {
    content: MultiLanguageFieldDto
    userGroups: string[]
  }
}

export interface IAdminUpdateGroupNotificationDto
  extends IUpdateGroupNotificationDto {
  mailSchedule?: {
    content: MultiLanguageFieldDto
    userGroups: string[]
  }
  pushSchedule?: {
    content: MultiLanguageFieldDto
    userGroups: string[]
  }
}
