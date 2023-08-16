import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'

@Entity({ name: 'setting_notifications' })
export class BceSettingNotification {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'thumbnail' })
  thumbnail: string

  @Column({ name: 'title_en' })
  titleEn: string

  @Column({ name: 'title_ja' })
  titleJa: string

  @Column({ name: 'content_en' })
  contentEn: string

  @Column({ name: 'content_ja' })
  contentJa: string

  @Column({ name: 'is_active' })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'public_at' })
  publicAt: Date
}
