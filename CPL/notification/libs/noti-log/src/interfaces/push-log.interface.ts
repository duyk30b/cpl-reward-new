import { IUserPushCommand } from '@libs/redis'

export interface ICreatePushLog {
  pushScheduleId?: string
  notificationId?: string
  userId: string
  success: boolean
  response: Record<string, any>
  data: IUserPushCommand
  error: string
}
