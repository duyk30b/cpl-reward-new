import { IMailCommand } from '@libs/redis'

export interface ICreateMailLog {
  userId?: string
  email: string
  success: boolean
  data: IMailCommand
  error: string
}
