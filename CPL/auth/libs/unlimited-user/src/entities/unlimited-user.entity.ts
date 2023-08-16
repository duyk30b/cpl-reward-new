import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'unlimited_users' })
export class UnlimitedUser extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id' })
  userId: string
}
