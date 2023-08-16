import { BaseEntityWithCreatedAt } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import {
  CompareStatus,
  DuplicateStatus,
  IdentityDocumentVerificationStatus,
  LivenessStatus,
} from '@lib/user-kyc/enum/user-kyc.enum'
import { SumsubReviewAnswer, SumsubReviewRejectType } from '@lib/sumsub'

@Entity()
export class SumsubInfoHistory extends BaseEntityWithCreatedAt {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'applicant_id' })
  @Expose({ name: 'applicant_id' })
  applicantId: string

  @Column({ name: 'user_kyc_history_id' })
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Column({ name: 'review_answer', type: 'varchar' })
  @Expose({ name: 'review_answer' })
  reviewAnswer: SumsubReviewAnswer

  @Column({ name: 'review_reject_type', type: 'varchar' })
  @Expose({ name: 'review_reject_type' })
  reviewRejectType: SumsubReviewRejectType

  @Column({ name: 'compare_status', type: 'int' })
  @Expose({ name: 'compare_status' })
  compareStatus: CompareStatus

  @Column({ name: 'liveness_status', type: 'int' })
  @Expose({ name: 'liveness_status' })
  livenessStatus: LivenessStatus

  @Column({ name: 'identity_document_verification_status', type: 'int' })
  @Expose({ name: 'identity_document_verification_status' })
  identityDocumentVerificationStatus: IdentityDocumentVerificationStatus

  @Column({ name: 'duplicate_status', type: 'int' })
  @Expose({ name: 'duplicate_status' })
  duplicateStatus: DuplicateStatus
}
