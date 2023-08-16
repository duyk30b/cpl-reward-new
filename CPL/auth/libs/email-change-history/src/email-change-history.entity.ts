import { TransformInt } from '@lib/util'
import { Expose } from 'class-transformer'
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'

@Entity()
export class EmailChangeHistory {
  @Expose()
  @PrimaryGeneratedColumn()
  id: string

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id' })
  userId: string

  @Expose({ name: 'old_email' })
  @Column({ name: 'old_email' })
  oldEmail: string

  @Expose({ name: 'new_email' })
  @Column({ name: 'new_email' })
  newEmail: string

  @Column({ name: 'is_modified_by_user' })
  @Expose({ name: 'is_modified_by_user' })
  isModifiedByUser: boolean

  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', default: null })
  @TransformInt()
  createdAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
  }
}
