export interface ISumsubApplicant {
  id: string
  inspectionId: string
  externalUserId: string
  fixedInfo: ISumsubApplicantInfo
  info: ISumsubApplicantInfo
  metadata: Array<Record<string, any>>
  createdAt: string
  review: ISumsubReview
}

export interface ISumsubApplicantInfo {
  firstName: string
  lastName: string
  middleName: string
  firstNameEn: string
  lastNameEn: string
  middleNameEn: string
  legalName: string
  gender: 'M' | 'F'
  dob: string
  placeOfBirth: string
  country: string
  nationality: string
  idDocs: ISumsubIdDoc[]
}

export interface ISumsubIdDoc {
  idDocType: SumsubIdDocType
  number: string
  country: string
  firstName: string
  firstNameEn: string
  lastName: string
  lastNameEn: string
  validUntil: string
}

export interface ISumsubReview {
  reviewResult: ISumsubReviewResult
  reviewStatus: SumsubReviewStatus
}

export interface ISumsubWebhookPayload {
  applicantId: string
  inspectionId: string
  levelName: string
  externalUserId: string
  type: SumsubWebhookType
  createdAt: string
  applicantType: SumsubApplicantType
  reviewResult: ISumsubReviewResult
  reviewStatus: SumsubReviewStatus
}

export interface ISumsubReviewResult {
  reviewAnswer: SumsubReviewAnswer
  reviewRejectType?: SumsubReviewRejectType
  rejectLabels?: string[]
}

export interface ISumsubImage {
  addedDate: string
  creatorClientId: string
  source: string
  imageFileName: string
  mimeType: string
  imageId: string
  fileSize: number
  actualResolution: { width: number; height: number }
  make?: string
  model?: string
  fullSoftwareMatches: boolean
  imageTrust: { trust: number }
  idDocDef: {
    country: string
    idDocType: SumsubIdDocType
    idDocSubType?: SumsubIdDocSubType
  }
  extractedInfo?: { screenRecapture: boolean }
  deleted: boolean
  answer: string
}

export interface ISumsubInspectionResponse {
  id: string
  inspectionDate: string
  inspectionResetDate?: string
  images: ISumsubImage[]
  checks: ISumsubCheck[]
}

export interface ISumsubSimilarApplicantsResponse {
  similarApplicants: ISumsubSimilarApplicant[]
}

export interface ISumsubSimilarApplicant {
  applicant: ISumsubApplicant
  blacklisted: boolean
  exactMatch: boolean
  faceMatchConfidence: number
  matchedFields: string[]
  originalImageId: string
  sameSource: boolean
  types: string[]
}

export interface ISumsubCheck {
  answer: SumsubReviewAnswer
  checkType: SumsubCheckType
  createdAt: string
  livenessInfo?: ISumsubLivenessInfo
  faceMatchInfo?: ISumsubFaceMatchInfo
  imageIds: string[]
}

export interface ISumsubLivenessInfo {
  deviceDesc: string
  livenessData: {
    images: {
      imageId: string
      ts: string
    }[]
  }
}

export interface ISumsubFaceMatchInfo {
  confidence: number
  originImageId1: number
  originImageId2: number
  faceContentId1: number
  faceContentId2: number
}

export type SumsubApplicantDocsStatus = {
  [step in SumsubStep]: ISumsubApplicantStepStatus
}

export interface ISumsubApplicantStatus {
  createDate: string
  reviewResult: ISumsubReviewResult
  reviewStatus: SumsubReviewStatus
}

export interface ISumsubApplicantStepStatus {
  reviewResult: {
    reviewAnswer: SumsubReviewAnswer
  }
  idDocType: SumsubIdDocType
  imageIds: string[]
}

export type SumsubWebhookType =
  | 'applicantReviewed'
  | 'applicantPending'
  | 'applicantCreated'
  | 'applicantOnHold'
  | 'applicantPersonalInfoChanged'
  | 'applicantPrechecked'
  | 'applicantDeleted'
  | 'videoIdentStatusChanged'
  | 'applicantReset'
  | 'applicantActionPending'
  | 'applicantActionReviewed'
  | 'applicantActionOnHold'

export enum SumsubApplicantType {
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}

export enum SumsubReviewAnswer {
  GREEN = 'GREEN',
  RED = 'RED',
}

export enum SumsubReviewRejectType {
  RETRY = 'RETRY',
  FINAL = 'FINAL',
}

export type SumsubReviewStatus =
  | 'init'
  | 'pending'
  | 'prechecked'
  | 'queued'
  | 'completed'
  | 'onHold'

export enum SumsubIdDocType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
  DRIVERS = 'DRIVERS',
  SELFIE = 'SELFIE',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
  OTHERS = 'OTHER',
}

export enum SumsubIdDocSubType {
  FRONT_SIDE = 'FRONT_SIDE',
  BACK_SIDE = 'BACK_SIDE',
}

export enum SumsubCheckType {
  FACE_LIVELINESS = 'FACE_LIVELINESS',
  FACE_MATCH = 'FACE_MATCH',
}

export enum SumsubStep {
  IDENTITY = 'IDENTITY',
  SELFIE = 'SELFIE',
}
