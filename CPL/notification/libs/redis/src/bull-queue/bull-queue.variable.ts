import { MultiLanguageFieldDto } from '@libs/common'

export const MAIL_COMMAND_QUEUE = 'notification:mail:command'
export const PUSH_COMMAND_QUEUE = 'notification:push:command'
export const GROUP_NOTIFICATION_QUEUE = 'notification:group'
export const PERSONAL_NOTIFICATION_QUEUE = 'notification:personal'
export const USER_FILTER_QUEUE = 'notification:user:filter'

export enum EUserFilterByGroupJob {
  PROCESS_ALL = 'process_all',
  PROCESS_CHUNK = 'process_chunk',
}

export enum EMethodAfterFilterUser {
  PUBLISH_GROUP_NOTIFICATION = 'publishGroupNotification',
  SEND_MAIL = 'sendMail',
  SEND_PUSH = 'sendPush',
}

export interface IPublishGroupNotificationAfterFilterUserArgs {
  temp: string
}

export interface ISendPushAfterFilterUserArgs {
  pushScheduleId: string
  notificationId?: string
  deeplink: string
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
}

export interface ISendMailAfterFilterUserArgs {
  temp: string
}

export type ArgsForMethodAfterUserFilter =
  | IPublishGroupNotificationAfterFilterUserArgs
  | ISendPushAfterFilterUserArgs
  | ISendMailAfterFilterUserArgs
