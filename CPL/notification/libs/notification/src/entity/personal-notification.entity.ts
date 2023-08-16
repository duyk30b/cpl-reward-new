import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { JsonColumnTransformer, BaseEntity } from '@libs/mysql'
import { MultiLanguageFieldDto } from '@libs/common'

@Entity()
export class PersonalNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'notification_category_id' })
  @Expose({ name: 'notification_category_id' })
  notificationCategoryId: number

  @Column({ name: 'is_read' })
  @Expose({ name: 'is_read' })
  isRead: boolean

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

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

  @Expose({ name: 'publish_at' })
  get publishAt() {
    return this.createdAt
  }
}
