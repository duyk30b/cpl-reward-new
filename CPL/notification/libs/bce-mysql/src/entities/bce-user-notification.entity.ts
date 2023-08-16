import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'

@Entity({ name: 'user_notifications' })
export class BceUserNotification {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'notification_id' })
  notificationId: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
