import { MultiLanguageFieldDto } from '@libs/common'

export enum EMailScheduleStatus {
  NEW = 2,
  PROCESSING = 3,
  COMPLETED = 1,
}

export interface ICreateMailSchedule {
  groupNotificationId?: string
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  publishAt?: number
  userGroups?: string[]
}

export interface IUpdateMailSchedule {
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  publishAt?: number
  userGroups?: string[]
}
