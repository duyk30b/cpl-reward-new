import { Observable } from 'rxjs'
import { IPostResponse } from '..'
import {
  IBaseFilter,
  IGetResponse,
  IPaginationMeta,
} from '../grpc-client.interface'

export interface IDataByUserId {
  userId: string
}

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

export interface IUserKyc {
  id: string
  userId: string
  userKycHistoryId: string
  idDocumentType: number
  status: number
  type: number
  provider: number
  files: string
  idDocumentNo: string
  riskRating: string
  compareDocumentType: boolean
  compareLivenessSelfie: boolean
  compareBirthday: boolean
  compareName: boolean
  rejectionReasons: IRejectionReasonDto[]
  remark: string
  countryId: number
  cynopsisProcessing: boolean
}

export interface IEnterpriseInfo {
  id: string
  userId: string
  userKycHistoryId: string
  idDocumentType: number
  status: number
  type: number
  provider: number
  files: string
  idDocumentNo: string
  riskRating: string
  compareDocumentType: boolean
  compareLivenessSelfie: boolean
  compareBirthday: boolean
  compareName: boolean
  rejectionReasons: string
  remark: string
  countryId: number
  cynopsisProcessing: boolean
}

export interface IUserKycCynopsis {
  id: string
  ocrStatus: number
  artemisStatus: number
  historyId: string
  customerId: number
  recordId: number
  crpId: number
  cynopsisData: string
}

export interface IUserKycAdminDecision {
  id: string
  userId: string
  userKycHistoryId: string
  status: number
  riskRating: string
  compareDocumentType: boolean
  compareLivenessSelfie: boolean
  compareBirthday: boolean
  compareName: boolean
  rejectionReasons: IRejectionReasonDto[]
  isAuto: boolean
  adminId: string
}

export interface IRekognitionInfoHistory {
  id: string
  userId: string
  userKycHistoryId: string
  image: string
  compareStatus: number
  faceId: string
  duplicateStatus: number
  imageUrl: string
  createdAt: string
}

export interface IRekognitionInfoHistoryDetail {
  id: string
  userKycRekognitionInfoId: string
  compareResponse: string
  compareError: string
  relatedFacesResponse: string
  relatedFacesError: string
  faceIndexResponse: string
  faceIndexError: string
}

export interface IKycImageProcessResult {
  provider: number
  compareStatus?: number
  duplicateStatus?: number
  livenessStatus?: number
  identityDocumentVerificationStatus?: number
  resultStatus?: number
  resultText?: string
}

export interface ISumsubDetail {
  userKycHistoryId: string
  inspectionResponse: string
  applicantDocsStatusResponse: string
  applicantStatusResponse: string
}

export interface IFindRelatedFace {
  faceId: string
  exceptUserId?: string
  limit?: number
  page?: number
}

export interface IRelatedFace {
  faceId: string
  similarity: string
  imageUrl: string
  detail: string
  detectedAt: number
}

export interface IFindRekognitionInfoHistoryWithUserInfoFilter
  extends IBaseFilter {
  faceId: string
  exceptUserId: string
}

export interface IRekognitionInfoHistoryWithUserInfo {
  faceId: string
  userId: string
  userKycHistoryId: string
  email: string
  detectedAt: number
}

export interface IRekognitionInfoHistoryWithUserInfoResponse {
  data: IRekognitionInfoHistoryWithUserInfo[]
  pagination: IPaginationMeta
}

export interface IUserKycService {
  findKycByUserId(
    userKycByUserId: IDataByUserId,
  ): Observable<IGetResponse<IUserKyc>>
  findEnterpriseInfoByUserId(
    enterpriseInfoByUserId: IDataByUserId,
  ): Observable<IGetResponse<IEnterpriseInfo>>
  findCynopsisByKycHistoryId(
    cynopsisByKycHistoryId: IDataByKycHistoryId,
  ): Observable<IGetResponse<IUserKycCynopsis>>
  reviewOcr(reviewOcrDto: IReviewOcrDto): Observable<IPostResponse>
  reviewRisk(reviewRiskDto: IReviewRiskDto): Observable<IPostResponse>
  checkDuplicateIdDocumentNo(
    checkDuplicateIdDocumentNoDto: ICheckDuplicateIdDocumentNoDto,
  ): Observable<{ valid: boolean }>
  renewCynopsisData(
    dataByKycHistoryId: IDataByKycHistoryId,
  ): Observable<IPostResponse>
  findAdminDecisionByUserId(
    adminDecisionByUserId: IDataByUserId,
  ): Observable<IGetResponse<IUserKycAdminDecision[]>>
  getImageProcessResultsByKycHistoryId(
    dataByKycHistoryId: IDataByKycHistoryId,
  ): Observable<IGetResponse<IKycImageProcessResult[]>>
  findRekognitionInfoHistoryByKycHistoryId(
    dataByKycHistoryId: IDataByKycHistoryId,
  ): Observable<IGetResponse<IRekognitionInfoHistory>>
  findRekognitionInfoHistoryDetail(
    dataByRekognitionInfoHistoryId: IDataByRekognitionInfoHistoryId,
  ): Observable<IGetResponse<IRekognitionInfoHistoryDetail>>
  findRelatedFaces(
    filter: IFindRelatedFace,
  ): Observable<IGetResponse<IRelatedFace[]>>
  findRekognitionInfoHistoryWithUserInfo(
    filter: IFindRekognitionInfoHistoryWithUserInfoFilter,
  ): Observable<IRekognitionInfoHistoryWithUserInfoResponse>
  rejectKyc(rejectKycDto: IRejectKycDto): Observable<IPostResponse>
  getSumsubFileMapByKycHistoryId(
    dataByKycHistoryId: IDataByKycHistoryId,
  ): Observable<IGetResponse<Record<string, string>>>
  getSumsubDetailByKycHistoryId(
    dataByKycHistoryId: IDataByKycHistoryId,
  ): Observable<ISumsubDetail>
}

export interface IRejectKycDto {
  userId: string
  rejectionReasons: IRejectionReasonDto[]
  adminId: string
}
