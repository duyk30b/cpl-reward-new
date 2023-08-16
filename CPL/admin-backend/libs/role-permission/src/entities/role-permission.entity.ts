import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'role_permission' })
export class RolePermissionEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Expose({ name: 'role_id' })
  @Column({ name: 'role_id' })
  roleId: string

  @Expose({ name: 'permission_id' })
  @Column({ name: 'permission_id' })
  permissionId: number
}
