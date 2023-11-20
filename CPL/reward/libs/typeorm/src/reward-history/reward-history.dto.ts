import { TARGET_USER, WALLET } from '@libs/typeorm/common/enum'
import { REWARD_HISTORY_STATUS } from './reward-history.enum'

export interface CriteriaRewardHistory {
  id?: number
  missionId?: number
  campaignId?: number
  userId?: string
  status?: REWARD_HISTORY_STATUS
  userType?: TARGET_USER

  ids?: number[]
  missionIds?: number[]
  userIds?: string[]
  statuses?: REWARD_HISTORY_STATUS[]

  fromTime?: number
  toTime?: number
}

export interface IGetRewardEarnedFilter {
  userId: string
  wallets?: WALLET[]
  fromTime?: number
  toTime?: number
}
