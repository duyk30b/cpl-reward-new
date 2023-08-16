import { Observable } from 'rxjs'
import {
  IBaseFilter,
  IPaginationMeta,
  IPostResponse,
} from '../grpc-client.interface'
import { JsonNameInterface } from '@lib/grpc-client/reason/interfaces/json-name.interface'
import { IUserEmailChangeHistory } from '@lib/grpc-client/email-change-history'
import { UserBlacklistHistoryDto } from '@lib/grpc-client/user/user.dto'

export interface UserById {
  id: string
}

export interface UserByIds {
  ids: string[]
}

export interface UserByEmails {
  emails: string[]
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
}

export interface UserList {
  data: IUser[]
}

export interface IUserFilterForManagement {
  page?: number
  perPage?: number
  isBanned?: number
  searchField?: string
  searchText?: string
  accountLv?: number
  levelStatus?: string
  accountStatus?: number
  riskRating?: number
  registeredChannel?: string
  kycStatus?: number
  kycType?: number
  sort?: string
  sortType?: 'ASC' | 'DESC'
  type?: number
}

export interface IUserFilterMarketingRequest {
  page?: number
  perPage?: number
  searchField?: string
  searchText?: string
  accountLv?: number
  riskRating?: number
  registeredChannel?: string
  referralEmail?: string
  tagIds?: string[]
  sort?: string
  sortType?: 'ASC' | 'DESC'
  startRegisterDate?: number
  endRegisterDate?: number
}

export interface IUserForManagement {
  userId: string
  fullName: string
  email: string
  authenticatorVerifyStatus: number
  userInfoStatus: number
  accountLv: number
  lastLogin: number
  createdAt: number
  riskRating: number
  kycStatus: number
  kycType: number
  referralEmail: number
  isBanned: number
  levelStatus: string
  socialLink: number
  ggId: string
  fbId: string
  appleId: string
  kycSubmittedDate: number
  referralGgId: string
  referralFbId: string
  referralAppleId: string
  accountStatus: number
}

export interface IUserForMarketing {
  userId: string
  fullName: string
  email: string
  accountLv: number
  createdAt: number
  riskRating: number
  referralEmail: number
  socialLink: number
  channelName: string
  tags: string[]
}

export interface GrpcResponse {
  status: string
  message?: string
}

export interface UsersExportInfo extends GrpcResponse {
  data: {
    isEmpty: boolean
    status?: number
    link?: string
    createdAt?: string
    finishedAt?: string
  }
}

export interface CreateUsersExportInfo extends GrpcResponse {
  data: {
    success: boolean
  }
}

export interface IListUserForManagement {
  data: IUserForManagement[]
  pagination: IPaginationMeta
}

export interface IListUserForMarketingResponse {
  data: IUserForMarketing[]
  pagination: IPaginationMeta
}

export interface IUsersExportType {
  type: string
}

export interface IBanUserReason {
  reason: JsonNameInterface
  category: JsonNameInterface
}

export interface IBanUser extends IUnbanUser {
  note?: string
  hour?: number
  reasons?: IBanUserReason[]
}

export interface IUnbanUser {
  id: string
}

export interface IUserFilterForHotWallet {
  page?: number
  perPage?: number
  keyword?: string
  userIds?: number[]
  notUserIds?: number[]
}

export interface IUserCreateBot {
  email: string
}

export interface IUserForHotWallet {
  userId: number
  email: string
}

export interface IListUserForHotWallet {
  data: IUserForHotWallet[]
  pagination: IPaginationMeta
}

export interface IUserFilter {
  page?: number
  limit?: number
  ids?: string[]
  type?: number
  statuses?: number[]
  kycVerifyStatuses?: number[]
  authenticatorVerifyStatuses?: number[]
  userInfoStatuses?: number[]
  accountLvFrom?: number
  accountLvTo?: number
  createdAtFrom?: string
  createdAtTo?: string
  lastLoginFrom?: string
  lastLoginTo?: string
  email?: string
  sort?: string
  sortType?: string
}

export interface IChangeEmailDto {
  userId: string
  email: string
}

export interface IUserBlacklistHistoryFilter extends IBaseFilter {
  userId: string
}

export interface IUserBlacklistHistory {
  id: string
  userId: string
  type: string
  reasons: IBanUserReason[]
  createdAt: string
}

export interface IListUserBlacklistHistoryResponse {
  data: UserBlacklistHistoryDto[]
  pagination: IPaginationMeta
}

export interface IUserService {
  searchByFilter(data: IUserFilter): Observable<UserList>
  banUser(data: IBanUser): Observable<IPostResponse>
  getUserBlacklistHistory(
    data: IUserBlacklistHistoryFilter,
  ): Observable<IListUserBlacklistHistoryResponse>
  unbanUser(data: IUnbanUser): Observable<IPostResponse>
  findOne(data: UserById): Observable<IUser>
  findByIds(data: UserByIds): Observable<UserList>
  findByEmails(data: UserByEmails): Observable<UserList>
  getListUserForManagement(
    userFilterForManagement: IUserFilterForManagement,
  ): Observable<IListUserForManagement>
  getListUserForMarketing(
    userFilterMarketingRequest: IUserFilterMarketingRequest,
  ): Observable<IListUserForMarketingResponse>
  getUsersExport(IUsersExportType): Observable<UsersExportInfo>
  createUsersExport(
    userFilterForManagement: IUserFilterForManagement,
  ): Observable<CreateUsersExportInfo>
  createUserMarketingExport(
    userFilter: IUserFilterMarketingRequest,
  ): Observable<CreateUsersExportInfo>
  getListUserForHotWallet(
    userFilterForHotWallet: IUserFilterForHotWallet,
  ): Observable<IListUserForHotWallet>
  createBot(user: IUserCreateBot): Observable<IPostResponse>
  resetAuthenticator(data: UserById): Observable<IPostResponse>
  changeEmail(changeEmailDto: IChangeEmailDto): Observable<IPostResponse>
}
