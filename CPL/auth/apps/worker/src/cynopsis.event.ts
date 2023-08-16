import { Expose } from 'class-transformer'

export class AutoKycFinishedEvent {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  pass: boolean
}
