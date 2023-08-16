import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'role' })
export class RoleEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column()
  @Expose()
  name: string

  @Column()
  @Expose()
  description: string

  @Expose()
  permissions: number[]

  @Expose()
  screens: number[]
}
