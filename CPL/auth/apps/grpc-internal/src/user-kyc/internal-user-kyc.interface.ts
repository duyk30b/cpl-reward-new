export interface IDataByKycHistoryId {
  userKycHistoryId: string
}

export interface IDataByRekognitionInfoHistoryId {
  rekognitionInfoHistoryId: string
}

export interface IReviewOcrDto {
  userId: string
  status: number
  compareBirthday: boolean
  compareDocumentType: boolean
  compareLivenessSelfie: boolean
  compareName: boolean
  idDocumentNo: string
  rejectionReasons: IRejectionReasonDto[]
  adminId: string
}

export interface IReviewRiskDto {
  userId: string
  status: number
  riskRating: number
  rejectionReasons: IRejectionReasonDto[]
  adminId: string
}

export interface ICheckDuplicateIdDocumentNoDto {
  idDocumentNo: string
  idDocumentType: number
  countryId: number
  exceptUserId: string
}

export interface IRejectionReasonDto {
  reasonCategoryId: number
  reasonCategoryNameEn: string
  reasonCategoryNameJa: string
  rejectionReasonId: number
  rejectionReasonNameEn: string
  rejectionReasonNameJa: string
}

export interface IImageProcessResult {
  provider: number
  compareStatus: number
  duplicateStatus: number
}

export interface IFindRelatedFaceRequest {
  faceId: string
  exceptUserId?: string
  limit?: number
  skip?: number
}

export interface IRejectKycDto {
  userId: string
  rejectionReasons: IRejectionReasonDto[]
  adminId: string
}
