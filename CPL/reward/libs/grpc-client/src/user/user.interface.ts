import { Observable } from 'rxjs'
import { IPaginationMeta } from '../grpc-client.interface'

export interface UserById {
  id: string
}

export interface IUser {
  id: string
  name: string
  phone: string
  phoneCountry: string
  email: string
  fbId: string
  ggId: string
  phoneVerifyAt: number
  status: string
  referrerCode: string
  referredById: number
  lastLogin: number
  type: string
  emailVerifyAt: number
  authenticatorVerifyAt: number
  createdAt: number
  updatedAt: number
  emailVerifyStatus: number
  authenticatorVerifyStatus: number
  kycVerifyStatus: number
  userInfoStatus: number
  accountLv: number
  appleId: string
  channelId: number
  lastPasswordChange: number
}

export interface IUserList {
  data: IUser[]
  pagination: IPaginationMeta
}

export interface IUserService {
  findOne(data: UserById): Observable<IUser>
}
