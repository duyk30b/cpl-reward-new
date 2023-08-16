import { Observable } from 'rxjs'
import { IGetResponse, IPostResponse } from '../grpc-client.interface'

export interface IDataByUserId {
  userId: string
}

export interface IUserInfo {
  id: string
  userId: string
  userInfoHistoryId: string
  firstName: string
  lastName: string
  fullName: string
  furigana1: string
  furigana2: string
  birthday: string
  phone: string
  phoneCountry: string
  buildingRoom: string
  address: string
  city: string
  stateRegion: string
  zipCode: string
  countryId: number
  nationalityId: number
  gender: number
}

export interface IUserKycHistory {
  id: string
  userId: string
  userInfoHistoryId: string
  idDocumentType: number
  status: number
  type: number
  provider: number
  files: string
  idDocumentNo: string
  remark: string
  countryId: number
  isModifiedByUser: number
}

export interface IUserInfoHistory {
  id: string
  userId: string
  firstName: string
  lastName: string
  fullName: string
  furigana1: string
  furigana2: string
  birthday: string
  phone: string
  phoneCountry: string
  buildingRoom: string
  address: string
  city: string
  stateRegion: string
  zipCode: string
  countryId: number
  nationalityId: number
  gender: number
  isModifiedByUser: number
  userKycHistory: IUserKycHistory
}

export interface IUpdateInfoDto {
  userId: string
  userInfo: IUserInfo
  idDocumentNo: string
  remark: string
}

export interface IUserInfoService {
  findByUserId(
    userInfoByUserId: IDataByUserId,
  ): Observable<IGetResponse<IUserInfo>>
  getListUserInfoHistory(
    dataByUserId: IDataByUserId,
  ): Observable<IGetResponse<IUserInfoHistory[]>>
  updateUserInfo(updateUserInfoDto: IUpdateInfoDto): Observable<IPostResponse>
}
