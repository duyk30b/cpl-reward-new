import { MultiLanguageFieldDto } from '@libs/common'
import { BaseEntity, JsonColumnTransformer } from '@libs/mysql'
import { Expose } from 'class-transformer'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { EMailScheduleStatus } from './mail-schedule.variable'

@Entity()
export class MailSchedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'group_notification_id' })
  @Expose({ name: 'group_notification_id' })
  groupNotificationId: string

  @Column({
    type: 'text',
    transformer: JsonColumnTransformer({ type: MultiLanguageFieldDto }),
  })
  @Expose()
  title: MultiLanguageFieldDto

  @Column({
    type: 'text',
    transformer: JsonColumnTransformer({ type: MultiLanguageFieldDto }),
  })
  @Expose()
  content: MultiLanguageFieldDto

  @Column({ name: 'publish_at' })
  @Expose({ name: 'publish_at' })
  publishAt: number

  @Column({ name: 'sent_at' })
  @Expose({ name: 'sent_at' })
  sentAt: number

  @Column({ type: 'int' })
  @Expose()
  status: EMailScheduleStatus

  @Column({
    name: 'user_groups',
    type: 'text',
    transformer: JsonColumnTransformer({ isArray: true }),
  })
  @Expose()
  userGroups: string[]
}
