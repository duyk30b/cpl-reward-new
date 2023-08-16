import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import {
  ISumsubInspectionResponse,
  ISumsubApplicantStatus,
  SumsubCheckType,
  SumsubIdDocType,
  SumsubApplicantDocsStatus,
  ISumsubApplicant,
  ISumsubSimilarApplicantsResponse,
} from '@lib/sumsub'
import { ISumsubFileMap } from '../user-kyc-sumsub.type'

@Entity()
export class SumsubResponse {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_kyc_history_id' })
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Column({
    name: 'inspection_response',
    type: 'json',
  })
  @Expose({ name: 'inspection_response' })
  inspectionResponse: ISumsubInspectionResponse

  @Column({
    name: 'applicant_status_response',
    type: 'json',
  })
  @Expose({ name: 'applicant_status_response' })
  applicantStatusResponse: ISumsubApplicantStatus

  @Column({
    name: 'applicant_docs_status_response',
    type: 'json',
  })
  @Expose({ name: 'applicant_docs_status_response' })
  applicantDocsStatusResponse: SumsubApplicantDocsStatus

  @Column({
    name: 'applicant_response',
    type: 'json',
  })
  @Expose({ name: 'applicant_response' })
  applicantResponse: ISumsubApplicant

  @Column({
    name: 'similar_applicants_response',
    type: 'json',
  })
  @Expose({ name: 'similar_applicants_response' })
  similarApplicantsResponse: ISumsubSimilarApplicantsResponse

  @Column({
    name: 'file_map',
    type: 'json',
  })
  @Expose({ name: 'file_map' })
  fileMap: ISumsubFileMap

  @Expose({ name: 'compare_response' })
  get compareResponse() {
    if (!this.inspectionResponse?.checks) return null
    return this.inspectionResponse.checks.find(
      (check) => check.checkType == SumsubCheckType.FACE_MATCH,
    )
  }

  @Expose({ name: 'liveness_response' })
  get livenessResponse() {
    if (!this.inspectionResponse?.checks) return null
    return this.inspectionResponse.checks
      .filter((check) => check.checkType == SumsubCheckType.FACE_LIVELINESS)
      .pop()
  }

  @Expose({ name: 'identity_document_verification_response' })
  get identityDocumentVerificationResponse() {
    if (
      !this.applicantDocsStatusResponse?.IDENTITY ||
      !this.inspectionResponse?.images
    )
      return null
    return {
      result: this.applicantDocsStatusResponse.IDENTITY,
      images: this.inspectionResponse.images.filter((image) =>
        [
          SumsubIdDocType.ID_CARD,
          SumsubIdDocType.PASSPORT,
          SumsubIdDocType.DRIVERS,
          SumsubIdDocType.RESIDENCE_PERMIT,
        ].includes(image.idDocDef.idDocType),
      ),
    }
  }

  get selfieImageId() {
    if (!this.inspectionResponse?.images) return
    const selfie = this.inspectionResponse?.images.find(
      (image) => image.idDocDef.idDocType == SumsubIdDocType.SELFIE,
    )
    return selfie?.imageId
  }
}
