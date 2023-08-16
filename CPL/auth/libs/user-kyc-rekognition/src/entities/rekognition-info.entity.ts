import { BaseEntityWithCreatedAt } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity()
export class RekognitionInfo extends BaseEntityWithCreatedAt {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'image' })
  @Expose({ name: 'image' })
  image: string

  @Column({ name: 'face_id' })
  @Expose({ name: 'face_id' })
  faceId: string
}
