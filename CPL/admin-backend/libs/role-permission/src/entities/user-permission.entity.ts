import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'user_permission' })
export class UserPermissionEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id' })
  userId: string

  @Expose({ name: 'permission_id' })
  @Column({ name: 'permission_id' })
  permissionId: number
}
