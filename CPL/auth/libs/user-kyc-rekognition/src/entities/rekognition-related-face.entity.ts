import { BaseEntityWithCreatedAt } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity()
export class RekognitionRelatedFace extends BaseEntityWithCreatedAt {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'origin_face_id' })
  @Expose({ name: 'origin_face_id' })
  originFaceId: string

  @Column({ name: 'related_face_id' })
  @Expose({ name: 'related_face_id' })
  relatedFaceId: string

  @Column()
  @Expose()
  similarity: number
}
