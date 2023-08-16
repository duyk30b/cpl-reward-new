import { MultiLanguageFieldDto } from '@libs/common'

export enum EPushScheduleStatus {
  NEW = 2,
  PROCESSING = 3,
  COMPLETED = 1,
}

export interface ICreatePushSchedule {
  groupNotificationId?: string
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  publishAt?: number
  userGroups?: string[]
}

export interface IUpdatePushSchedule {
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  publishAt?: number
  userGroups?: string[]
}
