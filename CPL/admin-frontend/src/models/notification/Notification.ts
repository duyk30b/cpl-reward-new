import { Exclude, Expose, instanceToPlain, Type } from 'class-transformer'
import { MultiLanguageField } from '../common/MultiLangField'

export class MailSchedule {
  @Expose()
  id: string

  @Expose({ name: 'group_notification_id' })
  groupNotificationId: string

  @Expose()
  @Type(() => MultiLanguageField)
  title: MultiLanguageField = new MultiLanguageField()

  @Expose()
  @Type(() => MultiLanguageField)
  content: MultiLanguageField = new MultiLanguageField()

  @Expose({ name: 'publish_at' })
  publishAt: number

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'sent_at' })
  sentAt: number

  @Expose()
  status: number

  @Expose()
  userGroups: string[]
}

export class PushSchedule {
  @Expose()
  id: string

  @Expose({ name: 'group_notification_id' })
  groupNotificationId: string

  @Expose()
  @Type(() => MultiLanguageField)
  title: MultiLanguageField = new MultiLanguageField()

  @Expose()
  @Type(() => MultiLanguageField)
  summary: MultiLanguageField = new MultiLanguageField()

  @Expose()
  @Type(() => MultiLanguageField)
  content: MultiLanguageField = new MultiLanguageField()

  @Expose({ name: 'publish_at' })
  publishAt: number

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'sent_at' })
  sentAt: number

  @Expose()
  status: number

  @Expose()
  userGroups: string[]
}

export class GroupNotification {
  @Expose()
  id: string

  @Expose({ name: 'notification_category_id' })
  notificationCategoryId: string

  @Expose()
  image: string

  @Expose()
  @Type(() => MultiLanguageField)
  title: MultiLanguageField = new MultiLanguageField()

  @Expose()
  @Type(() => MultiLanguageField)
  content: MultiLanguageField = new MultiLanguageField()

  @Expose({ name: 'is_active' })
  isActive = true

  @Expose({ name: 'publish_at' })
  publishAt: number | null

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'need_send_mail' })
  _needSendMail = false

  @Expose({ name: 'is_mail_sent' })
  isMailSent: boolean

  @Expose({ name: 'mail_sent_at' })
  mailSentAt: number

  @Expose({ name: 'need_send_push' })
  _needSendPush = false

  @Expose({ name: 'is_push_sent' })
  isPushSent: boolean

  @Expose({ name: 'push_sent_at' })
  pushSentAt: number

  @Expose({ name: 'mail_schedule' })
  @Type(() => MailSchedule)
  mailSchedule: MailSchedule = new MailSchedule()

  @Expose({ name: 'push_schedule' })
  @Type(() => PushSchedule)
  pushSchedule: PushSchedule = new PushSchedule()

  @Exclude()
  _isPublishNow = true

  get needSendPush() {
    return this._needSendPush
  }

  set needSendPush(val) {
    if (!this.pushSchedule) this.pushSchedule = new PushSchedule()
    this._needSendPush = !!val
  }

  get needSendMail() {
    return this._needSendMail
  }

  set needSendMail(val) {
    if (!this.mailSchedule) this.mailSchedule = new MailSchedule()
    this._needSendMail = !!val
  }

  @Expose({ name: 'is_publish_now' })
  get isPublishNow() {
    return !this.publishAt && this._isPublishNow
  }

  set isPublishNow(val) {
    this._isPublishNow = !!val
  }

  @Expose({ name: 'is_published' })
  isPublished: boolean

  get isPublishTimePassed() {
    return this.id && this.publishAt && this.publishAt <= new Date().getTime()
  }

  get submitData() {
    const data = instanceToPlain(this)
    if (this.isPublishNow) data.publish_at = new Date().getTime()
    return data
  }
}

export class NotificationCategory {
  @Expose()
  id: number

  @Expose()
  name: string
}

export enum ENotificationType {
  GLOBAL = 1,
  PERSONAL = 2,
}
