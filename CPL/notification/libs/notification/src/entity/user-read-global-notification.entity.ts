import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { BaseEntity } from '@libs/mysql'

@Entity()
export class UserReadGlobalNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'group_notification_id' })
  @Expose({ name: 'group_notification_id' })
  groupNotificationId: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string
}
