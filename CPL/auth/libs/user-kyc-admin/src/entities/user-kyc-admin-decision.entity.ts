import { BooleanColumnTransformer, MyBaseEntity } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { JsonColumnTransformer } from '@lib/util'
import { RejectionReasonDto } from '../dto/rejection-reason.dto'

@Entity()
export class UserKycAdminDecision extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'user_kyc_history_id' })
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Column()
  @Expose()
  status: number

  @Column({ name: 'risk_rating' })
  @Expose({ name: 'risk_rating' })
  riskRating: string

  @Column({
    name: 'compare_document_type',
    transformer: BooleanColumnTransformer,
  })
  @Expose({ name: 'compare_document_type' })
  compareDocumentType: boolean

  @Column({
    name: 'compare_liveness_selfie',
    transformer: BooleanColumnTransformer,
  })
  @Expose({ name: 'compare_liveness_selfie' })
  compareLivenessSelfie: boolean

  @Column({ name: 'compare_birthday', transformer: BooleanColumnTransformer })
  @Expose({ name: 'compare_birthday' })
  compareBirthday: boolean

  @Column({ name: 'compare_name', transformer: BooleanColumnTransformer })
  @Expose({ name: 'compare_name' })
  compareName: boolean

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({
    name: 'rejection_reasons',
    type: 'text',
    transformer: JsonColumnTransformer({
      isArray: true,
      type: RejectionReasonDto,
    }),
  })
  @Expose({ name: 'rejection_reasons' })
  rejectionReasons: RejectionReasonDto[]

  @Column({ name: 'admin_id' })
  @Expose({ name: 'admin_id' })
  adminId: string

  @Column({ name: 'is_auto' })
  @Expose({ name: 'is_auto' })
  isAuto: boolean
}
