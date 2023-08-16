import { TransformInt } from '@lib/util'
import { Expose, Type } from 'class-transformer'
import { MultiLanguageFieldDto } from '../grpc-client.dto'

export class MailScheduleDto {
  @Expose()
  id: string

  @Expose({ name: 'group_notification_id' })
  groupNotificationId: string

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  title: MultiLanguageFieldDto

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  content: MultiLanguageFieldDto

  @Expose({ name: 'publish_at' })
  @TransformInt()
  publishAt: number

  @Expose({ name: 'created_at' })
  @TransformInt()
  createdAt: number

  @Expose({ name: 'sent_at' })
  @TransformInt()
  sentAt: number

  @Expose()
  status: number

  @Expose()
  userGroups: string[]
}

export class PushScheduleDto {
  @Expose()
  id: string

  @Expose({ name: 'group_notification_id' })
  groupNotificationId: string

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  title: MultiLanguageFieldDto

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  content: MultiLanguageFieldDto

  @Expose({ name: 'publish_at' })
  @TransformInt()
  publishAt: number

  @Expose({ name: 'created_at' })
  @TransformInt()
  createdAt: number

  @Expose({ name: 'sent_at' })
  @TransformInt()
  sentAt: number

  @Expose()
  status: number

  @Expose()
  userGroups: string[]
}

export class GroupNotificationDto {
  @Expose()
  id: string

  @Expose({ name: 'notification_category_id' })
  notificationCategoryId: number

  @Expose()
  image: string

  @Expose()
  slug: string

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  title: MultiLanguageFieldDto

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  content: MultiLanguageFieldDto

  @Expose({ name: 'is_active' })
  isActive: boolean

  @Expose({ name: 'publish_at' })
  @TransformInt()
  publishAt: number

  @Expose({ name: 'created_at' })
  @TransformInt()
  createdAt: number

  @Expose({ name: 'need_send_mail' })
  needSendMail: boolean

  @Expose({ name: 'is_mail_sent' })
  isMailSent: boolean

  @Expose({ name: 'mail_sent_at' })
  @TransformInt()
  mailSentAt: number

  @Expose({ name: 'need_send_push' })
  needSendPush: boolean

  @Expose({ name: 'is_push_sent' })
  isPushSent: boolean

  @Expose({ name: 'push_sent_at' })
  @TransformInt()
  pushSentAt: number

  @Expose({ name: 'is_published' })
  isPublished: boolean

  @Expose({ name: 'mail_schedule' })
  @Type(() => MailScheduleDto)
  mailSchedule: MailScheduleDto

  @Expose({ name: 'push_schedule' })
  @Type(() => PushScheduleDto)
  pushSchedule: PushScheduleDto
}
