import { Expose } from 'class-transformer'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'

export enum BanUserEvent {
  CREATED = 'ban_user.created',
}

export class BanUserCreatedEvent {
  @Expose()
  name: string

  @Expose()
  key: string

  @Expose()
  host: string

  @Expose({ name: 'admin_action_id' })
  adminActionId: string

  @Expose({ name: 'admin_id' })
  adminId: string

  @Expose({ name: 'request_time' })
  requestTime: string

  @Expose()
  request: IRequestWithAccessToken
}
