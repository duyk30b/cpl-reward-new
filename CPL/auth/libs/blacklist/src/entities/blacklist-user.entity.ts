import { TransformInt } from '@lib/util'
import { Expose } from 'class-transformer'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { MyBaseEntity } from '@lib/util'

@Entity()
export class BlacklistUser extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('INDEX_USER_ID')
  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id' })
  userId: string

  @Column({ nullable: true })
  @Expose()
  note: string

  @Column({ default: 0 })
  @Expose()
  @TransformInt()
  until: number
}
