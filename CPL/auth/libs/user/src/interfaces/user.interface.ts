import { UserStatus, UserType } from '../enum/user.enum'

export interface IOldAdminUserForManagementFilter {
  page?: number
  perPage?: number
  status?: number
  levelStatus?: string
  selectedSearch?: string
  searchKey?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface INewAdminUserForManagementFilter {
  page?: number
  perPage?: number
  isBanned?: boolean
  searchField?: string
  searchText?: string
  accountLv?: number
  accountStatus?: UserStatus
  accountStatuses?: UserStatus[]
  levelStatus?: string
  riskRating?: number
  registeredChannel?: string
  kycStatus?: number
  kycType?: number
  type?: UserType
  types?: UserType[]
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IUserForMarketingFilter {
  page?: number
  perPage?: number
  searchField?: string
  searchText?: string
  accountLv?: number
  referralEmail?: string
  riskRating?: number
  registeredChannel?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IUserFilterForHotWallet {
  page?: number
  perPage?: number
  keyword?: string
  userIds?: number[]
  notUserIds?: number[]
}

export interface ICreateBotDto {
  email: string
}

export interface IUserFilter {
  page?: number
  limit?: number
  ids: string[]
  type: number
  statuses?: number[]
  kycVerifyStatuses?: number[]
  authenticatorVerifyStatuses?: number[]
  userInfoStatuses?: number[]
  accountLvFrom?: number
  accountLvTo?: number
  createdAtFrom?: number
  createdAtTo?: number
  lastLoginFrom?: number
  lastLoginTo?: number
  email?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface ICountReferralFiler {
  fromLv?: number
}
