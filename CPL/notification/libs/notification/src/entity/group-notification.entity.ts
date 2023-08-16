import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { JsonColumnTransformer, BaseEntity } from '@libs/mysql'
import { MultiLanguageFieldDto } from '@libs/common'

@Entity()
export class GroupNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'notification_category_id' })
  @Expose({ name: 'notification_category_id' })
  notificationCategoryId: number

  @Column()
  @Expose()
  image: string

  @Column()
  @Expose()
  thumbnail: string

  @Column()
  @Expose()
  slug: string

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

  @Column({ name: 'is_active' })
  @Expose({ name: 'is_active' })
  isActive: boolean

  @Column({ name: 'publish_at' })
  @Expose({ name: 'publish_at' })
  publishAt: number

  @Column({ name: 'need_send_mail' })
  @Expose({ name: 'need_send_mail' })
  needSendMail: boolean

  @Column({ name: 'is_mail_sent' })
  @Expose({ name: 'is_mail_sent' })
  isMailSent: boolean

  @Column({ name: 'mail_sent_at' })
  @Expose({ name: 'mail_sent_at' })
  mailSentAt: number

  @Column({ name: 'need_send_push' })
  @Expose({ name: 'need_send_push' })
  needSendPush: boolean

  @Column({ name: 'is_push_sent' })
  @Expose({ name: 'is_push_sent' })
  isPushSent: boolean

  @Column({ name: 'push_sent_at' })
  @Expose({ name: 'push_sent_at' })
  pushSentAt: number

  @Column({
    name: 'user_groups',
    type: 'text',
    transformer: JsonColumnTransformer({ isArray: true }),
  })
  @Expose()
  userGroups: string[]

  @Column({ name: 'is_global' })
  @Expose({ name: 'is_global' })
  isGlobal: boolean

  @Column({ name: 'is_published' })
  @Expose({ name: 'is_published' })
  isPublished: boolean
}
