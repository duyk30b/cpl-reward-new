export interface IRejectionReasonDto {
  reasonCategoryId: number
  reasonCategoryNameEn: string
  reasonCategoryNameJa: string
  rejectionReasonId: number
  rejectionReasonNameEn: string
  rejectionReasonNameJa: string
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

export class IUpdateUserInfoDto {
  userId: string
  firstName: string
  lastName: string
  furigana1: string
  furigana2: string
  birthday: string
  phoneCountry: string
  phone: string
  buildingRoom: string
  address: string
  city: string
  stateRegion: string
  zipCode: string
  countryId: number
  nationalityId: number
  gender: number
  remark: string
  idDocumentNo: string
}

export interface IUserInfoHistoryFilterDto {
  userId: string
}

export interface IRejectKycDto {
  userId: string
  rejectionReasons: IRejectionReasonDto[]
  adminId: string
}
