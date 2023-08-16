import { BaseEntityWithCreatedAt, JsonColumnTransformer } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity()
export class RekognitionIndex extends BaseEntityWithCreatedAt {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'face_id' })
  @Expose({ name: 'face_id' })
  faceId: string

  @Column({ name: 'sample_image' })
  @Expose({ name: 'sample_image' })
  sampleImage: string

  @Column({
    name: 'sample_index_response',
    type: 'json',
  })
  @Expose({ name: 'sample_index_response' })
  sampleIndexResponse: Record<string, any>
}
