import { Expose } from 'class-transformer'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'email_change_histories' })
export class BceEmailChangeHistory {
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

  @Column({ name: 'edit_by' })
  @Expose({ name: 'edit_by' })
  editBy: string

  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at' })
  createdAt: string
}
