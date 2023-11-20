import { Observable } from 'rxjs'
import { IGetResponse } from '../grpc-client.interface'

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

export interface IUserInfoService {
  findByUserId(userInfoByUserId: IDataByUserId): Observable<IGetResponse<IUserInfo>>
}
