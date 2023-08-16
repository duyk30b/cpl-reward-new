import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { TransformInt } from '@lib/util'

@Entity({ name: 'error_sync_user' })
export class ErrorSyncUser {
  @PrimaryColumn({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column()
  @Expose()
  status: number

  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', default: null })
  @TransformInt()
  createdAt: number

  @Expose({ name: 'resolved_at' })
  @Column({ name: 'resolved_at', default: null })
  @TransformInt()
  resolvedAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
  }
}
