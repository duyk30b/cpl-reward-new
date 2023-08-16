import { MultiLanguageFieldDto } from '@libs/common'
import { IBaseFilter } from '@libs/util'

export class ICreatePersonalNotification {
  notificationCategoryId: number
  userId: string
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
}

export class ICreateGroupNotificationDto {
  notificationCategoryId: number
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  isActive: boolean
  publishAt: number
  needSendMail: boolean
  needSendPush: boolean
  image: string
  userGroups: string[]
}

export class IUpdateGroupNotificationDto {
  id: string
  notificationCategoryId: number
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  isActive: boolean
  publishAt: number
  needSendMail: boolean
  needSendPush: boolean
  image: string
  userGroups: string[]
}

export interface IGroupNotificationFilter extends IBaseFilter {
  notificationCategoryId: number
  isActive: boolean
}
