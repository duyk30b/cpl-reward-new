import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'role_screen' })
export class RoleScreenEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Expose({ name: 'role_id' })
  @Column({ name: 'role_id' })
  roleId: string

  @Expose({ name: 'screen_id' })
  @Column({ name: 'screen_id' })
  screenId: number
}
