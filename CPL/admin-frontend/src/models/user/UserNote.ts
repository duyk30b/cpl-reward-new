import { Expose, Type } from 'class-transformer'
import { Admin } from '../admin-permission/Admin'

export class UserNote {
  @Expose()
  id: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'admin_id' })
  adminId: string

  @Expose()
  note: string

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose()
  @Type(() => Admin)
  admin: Admin
}
