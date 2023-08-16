import { Admin } from '@lib/admin'
import { TransformInt, TransformJson } from '@lib/util'
import { Expose, Type } from 'class-transformer'

export class RejectionReasonDto {
  @Expose({ name: 'reason_category_id' })
  reasonCategoryId: number

  @Expose({ name: 'reason_category_name_en' })
  reasonCategoryNameEn: string

  @Expose({ name: 'reason_category_name_ja' })
  reasonCategoryNameJa: string

  @Expose({ name: 'rejection_reason_id' })
  rejectionReasonId: number

  @Expose({ name: 'rejection_reason_name_en' })
  rejectionReasonNameEn: string

  @Expose({ name: 'rejection_reason_name_ja' })
  rejectionReasonNameJa: string
}

export class KycFileDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  metadata: string

  @Expose()
  path: string

  @Expose({ name: 'is_image' })
  isImage: boolean
}

export class UserKycDto {
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Expose({ name: 'id_document_type' })
  idDocumentType: number

  @Expose()
  status: number

  @Expose()
  type: number

  @Expose({ name: 'image_provider' })
  imageProvider: number

  @Expose({ name: 'risk_scan_provider' })
  riskScanProvider: number

  @Expose()
  @Type(() => KycFileDto)
  files: KycFileDto[]

  @Expose({ name: 'id_document_no' })
  idDocumentNo: string

  @Expose({ name: 'risk_rating' })
  riskRating: number

  @Expose({ name: 'compare_document_type' })
  compareDocumentType: boolean

  @Expose({ name: 'compare_liveness_selfie' })
  compareLivenessSelfie: boolean

  @Expose({ name: 'compare_birthday' })
  compareBirthday: boolean

  @Expose({ name: 'compare_name' })
  compareName: boolean

  @Expose({ name: 'rejection_reasons' })
  @Type(() => RejectionReasonDto)
  rejectionReasons: RejectionReasonDto

  @Expose()
  remark: string

  @Expose({ name: 'country_id' })
  countryId: number

  @Expose({ name: 'cynopsis_processing' })
  cynopsisProcessing: number
}

export class EnterpriseInfoDto {
  @Expose()
  id: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'applicant_name' })
  applicantName: string

  @Expose({ name: 'company_name' })
  companyName: string

  @Expose({ name: 'company_register_country' })
  companyRegisterCountry: number

  @Expose({ name: 'contact_number' })
  contactNumber: string

  @Expose({ name: 'login_email' })
  loginEmail: string

  @Expose({ name: 'company_location' })
  companyLocation: string

  @Expose({ name: 'applicant_job_title' })
  applicantJobTitle: string

  @Expose({ name: 'sources_funding' })
  sourcesFunding: string

  @Expose({ name: 'funding_currency' })
  fundingCurrency: string

  @Expose({ name: 'url_website' })
  urlWebsite: string

  @Expose({ name: 'entity_type' })
  entityType: string

  @Expose({ name: 'registered_date' })
  registeredDate: string

  @Expose({ name: 'ownership_structure_layer' })
  ownershipStructureLayer: string

  @Expose({ name: 'incorporation_number' })
  incorporationNumber: string

  @Expose({ name: 'reason_apply' })
  reasonApply: string

  @TransformJson({ toClassOnly: true })
  @Expose({ name: 'user_related_parties' })
  userRelatedParties: Array<any>
}

export class UserKycCynopsisDto {
  @Expose()
  id: string

  @Expose({ name: 'ocr_status' })
  ocrStatus: number

  @Expose({ name: 'artemis_status' })
  artemisStatus: number

  @Expose({ name: 'history_id' })
  historyId: string

  @Expose({ name: 'customer_id' })
  customerId: number

  @Expose({ name: 'record_id' })
  recordId: number

  @Expose({ name: 'crp_id' })
  crpId: number

  @TransformJson({ toClassOnly: true })
  @Expose({ name: 'cynopsis_data' })
  cynopsisData: string
}

export class UserKycAdminDecisionDto {
  @Expose()
  id: number

  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Expose()
  status: number

  @Expose({ name: 'risk_rating' })
  riskRating: string

  @Expose({ name: 'compare_document_type' })
  compareDocumentType: number

  @Expose({ name: 'compare_liveness_selfie' })
  compareLivenessSelfie: number

  @Expose({ name: 'compare_birthday' })
  compareBirthday: number

  @Expose({ name: 'compare_name' })
  compareName: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'rejection_reasons' })
  @Type(() => RejectionReasonDto)
  rejectionReasons: RejectionReasonDto[]

  @Expose({ name: 'is_auto' })
  isAuto: boolean

  @Expose({ name: 'admin_id' })
  adminId: string

  @Expose()
  admin: Admin
}

export class RekognitionInfoHistoryDto {
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Expose({ name: 'image' })
  image: string

  @Expose({ name: 'compare_status' })
  compareStatus: number

  @Expose({ name: 'face_id' })
  faceId: string

  @Expose({ name: 'duplicate_status' })
  duplicateStatus: number

  @Expose({ name: 'created_at' })
  @TransformInt()
  createdAt: string
}

export class RekognitionInfoHistoryDetailDto {
  @Expose()
  id: string

  @Expose({ name: 'rekognition_info_history_id' })
  rekognitionInfoHistoryId: string

  @Expose({ name: 'compare_response' })
  @TransformJson({ toClassOnly: true })
  compareResponse: string

  @Expose({ name: 'compare_error' })
  compareError: string

  @Expose({ name: 'related_faces_response' })
  @TransformJson({ toClassOnly: true })
  relatedFacesResponse: string

  @Expose({ name: 'related_faces_error' })
  relatedFacesError: string

  @Expose({ name: 'face_index_response' })
  @TransformJson({ toClassOnly: true })
  faceIndexResponse: string

  @Expose({ name: 'face_index_error' })
  faceIndexError: string
}

export class ImageProcessResultDto {
  @Expose()
  provider: number

  @Expose({ name: 'compare_status' })
  compareStatus: number

  @Expose({ name: 'duplicate_status' })
  duplicateStatus: number

  @Expose({ name: 'liveness_status' })
  livenessStatus: number

  @Expose({ name: 'identity_document_verification_status' })
  identityDocumentVerificationStatus: number

  @Expose({ name: 'result_status' })
  resultStatus: number

  @Expose({ name: 'result_text' })
  resultText: string
}

export class RelatedFaceDto {
  @Expose({ name: 'face_id' })
  faceId: string

  @Expose()
  similarity: string

  @Expose({ name: 'image_url' })
  imageUrl: string

  @Expose()
  @TransformJson({ toClassOnly: true })
  detail: string

  @Expose({ name: 'detected_at' })
  @TransformInt()
  detectedAt: number
}

export class RekognitionInfoHistoryWithUserInfo {
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'face_id' })
  faceId: string

  @Expose()
  email: string

  @Expose({ name: 'detected_at' })
  detectedAt: number
}

export class SumsubDetailDto {
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Expose({ name: 'inspection_response' })
  @TransformJson({ toClassOnly: true })
  inspectionResponse: string

  @Expose({ name: 'applicant_docs_status_response' })
  @TransformJson({ toClassOnly: true })
  applicantDocsStatusResponse: string

  @Expose({ name: 'applicant_status_response' })
  @TransformJson({ toClassOnly: true })
  applicantStatusResponse: string

  @Expose({ name: 'applicant_response' })
  @TransformJson({ toClassOnly: true })
  applicantResponse: string

  @Expose({ name: 'similar_applicants_response' })
  @TransformJson({ toClassOnly: true })
  similarApplicantsResponse: string
}
