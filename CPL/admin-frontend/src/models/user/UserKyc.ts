import { formatFieldByLocale } from '@/core/helpers/common.helper'
import { Expose, Type } from 'class-transformer'
import { Admin } from '../admin-permission/Admin'

export class BaseUserKyc {
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'id_document_type' })
  idDocumentType: number

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

  @Expose()
  remark: string

  @Expose({ name: 'country_id' })
  countryId: number

  get imageFiles() {
    if (!this.files) return []
    return this.files.filter((file) => file.isImage)
  }

  get imageUrls() {
    return this.imageFiles.map((file) => file.path)
  }

  get frontDocumentFile() {
    return this.files.find((file) => {
      return (
        [
          KycIdDocumentMetadata.PASSPORT,
          KycIdDocumentMetadata.ID_CARD_FRONT,
          KycIdDocumentMetadata.DRIVING_LICENCE_FRONT,
          KycIdDocumentMetadata.RESIDENCE_CARD_FRONT,
          KycIdDocumentMetadata.NUMBER_CARD_FRONT,
        ] as string[]
      ).includes(file.metadata)
    })
  }

  get faceFile() {
    return this.files.find(
      (file) =>
        file.metadata == KycIdDocumentMetadata.SELFIE ||
        file.metadata == KycIdDocumentMetadata.FACE_RECOGNITION,
    )
  }

  getFileByMetadata(metadata: KycIdDocumentMetadata) {
    if (!this.files) return null
    return this.files.find((e) => e.metadata == metadata)
  }
}

export class UserKyc extends BaseUserKyc {
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Expose()
  status: number

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
  rejectionReasons: RejectionReasonDto[]

  get needShowRejectionReasons() {
    return this.status == KycStatus.REJECT
  }
}

export class UserKycHistory extends BaseUserKyc {
  @Expose({ name: 'user_info_history_id' })
  userInfoHistoryId: string

  get userKycHistoryId() {
    return this.id
  }
}

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

  get nameByLocale() {
    return formatFieldByLocale(this, 'rejectionReasonName')
  }
}

export class ReviewOcrRequest {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  status: number

  @Expose({ name: 'compare_birthday' })
  compareBirthday: number

  @Expose({ name: 'compare_document_type' })
  compareDocumentType: number

  @Expose({ name: 'compare_liveness_selfie' })
  compareLivenessSelfie: number

  @Expose({ name: 'compare_name' })
  compareName: number

  @Expose({ name: 'id_document_no' })
  idDocumentNo: string

  @Expose({ name: 'rejection_reasons' })
  @Type(() => RejectionReasonDto)
  rejectionReasons: RejectionReasonDto[]
}

export class UserKycAdminDecision {
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
  @Type(() => Admin)
  admin: Admin
}

export class ReviewRiskRequest {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  status: number

  @Expose({ name: 'risk_rating' })
  riskRating: number

  @Expose({ name: 'rejection_reasons' })
  @Type(() => RejectionReasonDto)
  rejectionReasons: RejectionReasonDto[]
}

export class FindRelatedFaceDto {
  @Expose({ name: 'face_id' })
  faceId: string

  @Expose({ name: 'except_user_id' })
  exceptUserId?: string

  @Expose()
  page?: number

  @Expose()
  limit?: number
}

export interface ICheckDuplicateIdDocumentNoRequest {
  id_document_no: string
  id_document_type: number
  country_id: number
  except_user_id: string
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

export enum RiskRating {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  UNKNOWN = 4,
  FAIL_INFO = 5,
  SCREENING = 6,
}

export enum KycIdDocumentType {
  PASSPORT = 1,
  ID_CARD = 2,
  DRIVING_LICENCE = 3,
  OTHERS = 4,
  RESIDENCE_CARD = 5,
  NUMBER_CARD = 6,
}

export enum KycIdDocumentMetadata {
  ID_CARD_FRONT = 'ID_CARD_FRONT',
  ID_CARD_BACK = 'ID_CARD_BACK',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENCE_FRONT = 'DRIVING_LICENCE_FRONT',
  DRIVING_LICENCE_BACK = 'DRIVING_LICENCE_BACK',
  RESIDENCE_CARD_FRONT = 'RESIDENCE_CARD_FRONT',
  RESIDENCE_CARD_BACK = 'RESIDENCE_CARD_BACK',
  NUMBER_CARD_FRONT = 'NUMBER_CARD_FRONT',
  NUMBER_CARD_BACK = 'NUMBER_CARD_BACK',
  SELFIE = 'SELFIE',
  FACE_RECOGNITION = 'FACE_RECOGNITION',
  ADDITION_DOCUMENTS = 'ADDITION_DOCUMENTS',
  CERTIFICATE_BUSINESS = 'CERTIFICATE_BUSINESS',
  MEMORANDUM_ARTICLES = 'MEMORANDUM_ARTICLES',
  OFFICIAL_COMPANY_REPORT = 'OFFICIAL_COMPANY_REPORT',
  LETTER_AUTHORIZATION = 'LETTER_AUTHORIZATION',
  SUPPLEMENTARY_INFORMATION = 'SUPPLEMENTARY_INFORMATION',
}

export enum KycType {
  PERSONAL = 1,
  ENTERPRISE = 2,
}

export enum KycStatus {
  ACCEPT = 1,
  REJECT = 2,
  PENDING = 3,
  APPROVED_PAPER = 4,
  NEW = 5,
  AUTO_KYC_PROCESSED = 7,
  PENDING_PAPER = 8,
}

export enum Kyc3rdProvider {
  CYNOPSIS = 1,
}
