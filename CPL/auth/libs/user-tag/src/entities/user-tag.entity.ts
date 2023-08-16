import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity()
export class UserTag extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Expose({ name: 'tagId' })
  @Column({ name: 'tag_id' })
  tagId: string

  @Expose({ name: 'userId' })
  @Column({ name: 'user_id' })
  userId: string
}
