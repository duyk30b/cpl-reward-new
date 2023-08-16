import { MyBaseEntity } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { EUserEmailType } from '../user-email.enum'

@Entity()
export class UserEmail extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column()
  @Expose()
  email: string

  @Column({ type: 'varchar' })
  @Expose()
  type: EUserEmailType
}
