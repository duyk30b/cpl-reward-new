export interface IFilterMission {
  userId: string
  eventName: string
  data: Record<string, any>
  messageId: string
  createTime: number
}

export interface ICheckCondition {
  groupKey: string
  messageId: string
  userId: string
  eventName: string
  data: Record<string, any>
  missionId: number
  campaignId: number
  createTime: number
}

export interface ICheckBudget {
  missionId: number
  messageId: string
  userId: string
  referrerUserId: string
  data: Record<string, any>
  createTime: number
}

export interface ISendReward {
  userId: string
  messageId: string
  userRewardHistoryId: number
  tagIds: number[]
}

export interface IRewardTagUser {
  userId: number
  tagIds: number[]
}
