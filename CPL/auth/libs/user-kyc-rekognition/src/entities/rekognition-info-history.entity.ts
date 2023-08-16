import { BaseEntityWithCreatedAt } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity()
export class RekognitionInfoHistory extends BaseEntityWithCreatedAt {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'user_kyc_history_id' })
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Column({ name: 'image' })
  @Expose({ name: 'image' })
  image: string

  @Column({ name: 'compare_status' })
  @Expose({ name: 'compare_status' })
  compareStatus: number

  @Column({ name: 'face_id' })
  @Expose({ name: 'face_id' })
  faceId: string

  @Column({ name: 'duplicate_status' })
  @Expose({ name: 'duplicate_status' })
  duplicateStatus: number
}
