export interface IUserByIds {
  ids: string[]
}

export interface IUserByEmails {
  emails: string[]
}

export interface IUserByEmail {
  email: string
}

export interface IBanUser extends IUnbanUser {
  note: string
  hour: number
}

export interface IUnbanUser {
  id: string
}

export interface UserExportTypeInterface {
  type: string
}

export interface IUserFilterMarketing {
  page?: number
  perPage?: number
  searchField?: string
  searchText?: string
  accountLv?: number
  referralEmail?: string
  tagIds?: string[]
  riskRating?: number
  registeredChannel?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  startRegisterDate?: number
  endRegisterDate?: number
}

export interface IUserFilterForManagement {
  page?: number
  perPage?: number
  isBanned?: boolean
  searchField?: string
  searchText?: string
  accountLv?: number
  levelStatus?: string
  riskRating?: number
  registeredChannel?: string
  kycStatus?: number
  kycType?: number
  type?: number
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IValidateOtpDto {
  userId: string
  otp: string
}
