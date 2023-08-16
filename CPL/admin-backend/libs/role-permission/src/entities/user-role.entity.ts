import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'user_role' })
export class UserRoleEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id' })
  userId: string

  @Expose({ name: 'role_id' })
  @Column({ name: 'role_id' })
  roleId: string
}
