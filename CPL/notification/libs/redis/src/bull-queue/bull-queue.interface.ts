import { UserCondition } from '@libs/user-group/user-group.variable'
import {
  ArgsForMethodAfterUserFilter,
  EMethodAfterFilterUser,
} from './bull-queue.variable'

export interface IMailCommand {
  userId?: string
  email?: string
  lang?: string
  data: Record<string, any>
  template: {
    subject: string
    file?: string
    html?: string
  }
}

export interface IUserPushCommand extends IBasePushCommand {
  userId: string
}

export interface IBasePushCommand {
  pushScheduleId?: string
  notificationId?: string
  data: {
    deeplink: string
  }
  notification: {
    title: string
    body: string
    sound?: string
    badge?: string
  }
}

export interface IFilterAllUserByGroupJob {
  userGroupIds: string[]
  methodAfterFilter: EMethodAfterFilterUser
  args: ArgsForMethodAfterUserFilter
}

export interface IFilterChunkUserByConditionsJob {
  userIds: string[]
  conditionGroups: UserCondition[][]
  methodAfterFilter: EMethodAfterFilterUser
  args: ArgsForMethodAfterUserFilter
}
