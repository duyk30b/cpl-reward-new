import {
  ISumsubApplicant,
  ISumsubApplicantStatus,
  ISumsubInspectionResponse,
  ISumsubSimilarApplicantsResponse,
  SumsubApplicantDocsStatus,
  SumsubReviewAnswer,
  SumsubReviewRejectType,
} from '@lib/sumsub'
import {
  CompareStatus,
  DuplicateStatus,
  IdentityDocumentVerificationStatus,
  LivenessStatus,
} from '@lib/user-kyc/enum/user-kyc.enum'

export interface ICreateSumsubInfoHistoryDto {
  userId: string
  userKycHistoryId: string
  applicantId?: string
  reviewAnswer?: SumsubReviewAnswer
  reviewRejectType?: SumsubReviewRejectType
  compareStatus?: CompareStatus
  livenessStatus?: LivenessStatus
  identityDocumentVerificationStatus?: IdentityDocumentVerificationStatus
  duplicateStatus?: DuplicateStatus
}

export interface IUpsertSumsubResponse {
  applicantResponse?: ISumsubApplicant
  inspectionResponse?: ISumsubInspectionResponse
  applicantDocsStatusResponse?: SumsubApplicantDocsStatus
  applicantStatusResponse?: ISumsubApplicantStatus
  similarApplicantsResponse?: ISumsubSimilarApplicantsResponse
  fileMap: ISumsubFileMap
}

export interface ISumsubFileMap {
  [imageId: string]: {
    name: string
    host: string
  }
}
