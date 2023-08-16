import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { JsonColumnTransformer } from '@libs/mysql'
import { MultiLanguageFieldDto } from '@libs/common/dto/multi-language-field.dto'

@Entity()
export class SystemPushNotificationSetting {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column()
  @Expose()
  type: string

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
}
