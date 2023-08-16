import { TransformInt } from '@lib/util'
import { Expose } from 'class-transformer'

export class EmailChangeHistoryDto {
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'old_email' })
  oldEmail: string

  @Expose({ name: 'new_email' })
  newEmail: string

  @Expose({ name: 'is_modified_by_user' })
  isModifiedByUser: boolean

  @Expose({ name: 'created_at' })
  @TransformInt()
  createdAt: string
}
