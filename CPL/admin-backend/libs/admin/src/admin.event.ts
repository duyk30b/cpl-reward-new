import { Expose } from 'class-transformer'

export enum AdminEvent {
  CREATED = 'admin.created',
}

export class AdminCreatedEvent {
  @Expose()
  email: string

  @Expose()
  name: string

  @Expose()
  password: string

  @Expose({ name: 'authenticator_secret' })
  authenticatorSecret: string
}
