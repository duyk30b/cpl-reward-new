import { getIndexFaceBoundingBoxs } from '@/core/helpers/common.helper'
import { Expose } from 'class-transformer'
import {
  CompareFacesResponse,
  IndexFacesResponse,
  SearchFacesResponse,
} from '@/models/common/AmazonRekognition'
import {
  ISumsubInspectionResponse,
  ISumsubApplicantStatus,
  SumsubApplicantDocsStatus,
  SumsubCheckType,
  SumsubIdDocType,
  ISumsubApplicant,
  ISumsubSimilarApplicantsResponse,
} from '../common/Sumsub'

export const IGNORED_FACE_COLOR = '#c8cad3'

export class UserKycCynopsis {
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

  @Expose({ name: 'cynopsis_data' })
  cynopsisData: ICynopsisData
}

export interface ICynopsisData {
  DJ: IDJData[]
  internetSearch: IInternetSearchData[]
  ArtemiScan: IArtemiScanData[]
  riskReport: IRiskReportData[]
}

export interface IDJData {
  id: number
  createdAt: string
  recordType: string
  searchResults: Array<IDJDataResult>
}

export interface IDJDataResult {
  id: number
  createdAt: string
  searchResponse: Record<string, any>
}

export interface IInternetSearchData {
  id: number
  createdAt: string
  internetSearchResults: Array<IInternetSearchDataResult>
}

export interface IInternetSearchDataResult {
  id: number
  createdAt: string
  nlpJson: Record<string, any>
}

export interface IArtemiScanData {
  id: number
  createdAt: string
  recordType: string
  searchResults: Array<any>
}

export interface IRiskReportData {
  id: number
  createdAt: string
  riskJson: IRiskJson
}

export interface IRiskJson {
  riskRating: string
  riskScore: number
  settings: {
    weight: {
      CORPORATE: any
      INDIVIDUAL: any
    }
  }
  componentScore: any
}

export enum OcrStatus {
  MATCHED = 1,
  NOT_MATCHED = 2,
  UNCERTAIN = 3,
  ERROR = 4,
  NOT_RUNNING_YET = 5,
}

export enum ArtemisStatus {
  DONE = 1,
  ERROR = 4,
  NOT_RUNNING_YET = 5,
}

export class ImageProcessResult {
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

  get compareFacePass() {
    return this.compareStatus == OcrStatus.MATCHED
  }

  get checkDuplicatePass() {
    return this.duplicateStatus == DuplicateFaceStatus.NOT_DUPLICATE
  }

  get checkDuplicateWarning() {
    return this.duplicateStatus == DuplicateFaceStatus.WARNING
  }

  get livenessPass() {
    return this.livenessStatus == LivenessStatus.PASS
  }

  get identityDocumentVerificationPass() {
    return (
      this.identityDocumentVerificationStatus ==
      IdentityDocumentVerificationStatus.PASS
    )
  }
}

export class RekognitionInfoHistory {
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
  createdAt: number
}

export class RekognitionInfoHistoryDetail {
  @Expose()
  id: string

  @Expose({ name: 'user_kyc_rekognition_info_id' })
  userKycRekognitionInfoHistoryId: string

  @Expose({ name: 'compare_response' })
  compareResponse: CompareFacesResponse

  @Expose({ name: 'compare_error' })
  compareError: string

  @Expose({ name: 'related_faces_response' })
  relatedFacesResponse: SearchFacesResponse

  @Expose({ name: 'related_faces_error' })
  relatedFacesError: string

  @Expose({ name: 'face_index_response' })
  faceIndexResponse: IndexFacesResponse

  @Expose({ name: 'face_index_error' })
  faceIndexError: string

  get compareFaceSourceBoundingBox() {
    return this.compareResponse?.SourceImageFace?.BoundingBox
  }

  get compareFaceSimilarity() {
    return this.compareResponse?.FaceMatches?.[0]?.Similarity
  }

  get compareFaceTargetBoundingBoxs() {
    const matched = (this.compareResponse?.FaceMatches || []).map(
      (face) => face.Face?.BoundingBox,
    )
    const unmatched = (this.compareResponse?.UnmatchedFaces || []).map(
      (face) => ({ ...face.BoundingBox, color: IGNORED_FACE_COLOR }),
    )
    return [...matched, ...unmatched]
  }

  get faceIndexBoundindBoxs() {
    return getIndexFaceBoundingBoxs(this.faceIndexResponse)
  }
}

export class RelatedFaceDto {
  @Expose({ name: 'face_id' })
  faceId: string

  @Expose()
  similarity: string

  @Expose({ name: 'image_url' })
  imageUrl: string

  @Expose()
  detail: IndexFacesResponse

  @Expose({ name: 'detected_at' })
  detectedAt: number

  get boundingBoxs() {
    return getIndexFaceBoundingBoxs(this.detail)
  }
}

export enum KycImageProvider {
  CYNOPSIS = 1,
  AMAZON = 2,
  SUMSUB = 3,
}

export enum DuplicateFaceStatus {
  NOT_DUPLICATE = 1,
  HAVE_DUPLICATE = 2,
  WARNING = 3,
  UNKNOWN = 4,
}

export enum LivenessStatus {
  PASS = 1,
  FAIL = 2,
  UNKNOWN = 3,
}

export enum IdentityDocumentVerificationStatus {
  PASS = 1,
  FAIL = 2,
  UNKNOWN = 3,
}

export enum KycProviderResultStatus {
  PASS = 1,
  FAIL = 2,
}

export class SumsubDetail {
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Expose({ name: 'inspection_response' })
  inspectionResponse: ISumsubInspectionResponse

  @Expose({ name: 'applicant_status_response' })
  applicantStatusResponse: ISumsubApplicantStatus

  @Expose({ name: 'applicant_docs_status_response' })
  applicantDocsStatusResponse: SumsubApplicantDocsStatus

  @Expose({ name: 'applicant_response' })
  applicantResponse: ISumsubApplicant

  @Expose({ name: 'similar_applicants_response' })
  similarApplicantsResponse: ISumsubSimilarApplicantsResponse

  get compareResponse() {
    if (!this.inspectionResponse?.checks) return null
    return this.inspectionResponse.checks.find(
      (check) => check.checkType == SumsubCheckType.FACE_MATCH,
    )
  }

  get livenessResponse() {
    if (!this.inspectionResponse?.checks) return null
    return this.inspectionResponse.checks
      .filter((check) => check.checkType == SumsubCheckType.FACE_LIVELINESS)
      .pop()
  }

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
}
