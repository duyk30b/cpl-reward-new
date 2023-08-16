import { Admin } from '@lib/admin'
import { MyBaseEntity } from '@lib/util'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user_note' })
export class UserNote extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'admin_id' })
  @Expose({ name: 'admin_id' })
  adminId: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'note' })
  @Expose({ name: 'note' })
  note: string

  @Expose()
  admin: Admin
}
